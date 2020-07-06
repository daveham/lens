import ImageCompass, { ImageCompassMode } from './imageCompass';

class DicePlan {
  grain;
  step;
  depth;

  /**
   * Create a dice plan for slicing image data.
   * @param {(DicePlan|Size|number)} args - grain, step, depth
   */
  constructor(...args) {
    if (args[0].calculateBasePlan) {
      const [otherPlan, requestedDepth = 0] = args;
      const basePlan = otherPlan.depth > 0 ? otherPlan.calculateBasePlan() : otherPlan;
      this.grain =
        requestedDepth === 0
          ? basePlan.grain.clone()
          : basePlan.calculateSizeAtGreaterDepth(requestedDepth);
      this.step = basePlan.step.clone();
      this.depth = requestedDepth;
    } else {
      [this.grain, this.step, this.depth = 0] = args;
    }
  }

  calculateSizeAtGreaterDepth(increase) {
    const { grain, step } = this;
    let nextGrain = grain;
    if (increase > 0) {
      while (increase--) {
        nextGrain = nextGrain.multiply(step);
      }
    }
    return nextGrain.floor();
  }

  calculateSizeAtLesserDepth(decrease) {
    const { grain, step } = this;
    let nextGrain = grain;
    if (decrease > 0) {
      while (decrease--) {
        nextGrain = nextGrain.divide(step);
      }
    }
    return nextGrain.floor();
  }

  calculateSizeAtDepth(depth) {
    return depth > this.depth
      ? this.calculateSizeAtGreaterDepth(depth - this.depth)
      : this.calculateSizeAtLesserDepth(this.depth - depth);
  }

  calculateBasePlan() {
    if (this.depth) {
      const baseGrain = this.calculateSizeAtLesserDepth(this.depth);
      return new DicePlan(baseGrain, this.step);
    }
    return this;
  }

  calculatePlanAtGreaterDepth(increase) {
    if (increase < 0) {
      throw new Error('New depth should be greater than 0');
    }
    if (this.depth) {
      throw new Error('Derived plans should be created from a base plan (depth == 0)');
    }

    if (increase) {
      const greaterGrain = this.calculateSizeAtGreaterDepth(increase);
      return new DicePlan(greaterGrain, this.step, increase);
    }
    return new DicePlan(this);
  }

  calculatePlanAtLesserDepth(decrease) {
    if (decrease > this.depth) {
      throw new Error('New depth would be less than 0');
    }

    if (decrease) {
      const lesserGrain = this.calculateSizeAtLesserDepth(decrease);
      return new DicePlan(lesserGrain, this.step, this.depth - decrease);
    }
    return new DicePlan(this);
  }

  calculatePlanAtDepth(depth) {
    return depth > this.depth
      ? this.calculatePlanAtGreaterDepth(depth - this.depth)
      : this.calculatePlanAtLesserDepth(this.depth - depth);
  }

  createCompass(size, lapped = false) {
    if (size.width < 1) {
      throw new Error('width argument out of range');
    }
    if (size.height < 1) {
      throw new Error('height argument out of range');
    }

    return new ImageCompass(size, this.grain, ImageCompassMode.normal, lapped);
  }

  createCompassAtDepth(size, depth, lapped = false) {
    if (size.width < 1) {
      throw new Error('width argument out of range');
    }
    if (size.height < 1) {
      throw new Error('height argument out of range');
    }
    if (depth < 0) {
      throw new Error('depth argument out of range');
    }

    const plan = this.calculateBasePlan().calculatePlanAtGreaterDepth(depth);
    return new ImageCompass(size, plan.grain, ImageCompassMode.Normal, lapped);
  }
}

export default DicePlan;
