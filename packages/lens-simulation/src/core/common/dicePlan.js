import Size from '../../basic/size';
import ImageCompass, { ImageCompassMode } from './imageCompass';

class DicePlan {
  grainX;
  grainY;
  stepX;
  stepY;
  depth;

  constructor(arg0) {
    const args = arguments;
    const type = typeof arg0;
    if (type === 'number') {
      if (args.length >= 4) {
        // ctor (grainX, grainY, stepX, stepY, depth = 0)
        this.grainX = args[0];
        this.grainY = args[1];
        this.stepX = args[2];
        this.stepY = args[3];
        this.depth = args[4] || 0;
      } else {
        // ctor (grain, step, depth = 0)
        this.grainX = args[0];
        this.grainY = args[0];
        this.stepX = args[1];
        this.stepY = args[1];
        this.depth = args[2] || 0;
      }
    } else if (type === 'object') {
      if (args.length > 1) {
        // ctor (otherPlan, depth)
        const [otherPlan, depth] = arguments;
        const basePlan = otherPlan.depth > 0 ? otherPlan.calculateBasePlan() : otherPlan;
        if (depth === 0) {
          this.grainX = basePlan.grainX;
          this.grainY = basePlan.grainY;
        } else {
          const { width, height } = basePlan.calculateSizeAtGreaterDepth(depth);
          this.grainX = width;
          this.grainY = height;
        }
        this.stepX = basePlan.stepX;
        this.stepY = basePlan.stepY;
        this.depth = depth;
      } else {
        // ctor (otherPlan)
        this.grainX = arg0.grainX;
        this.grainY = arg0.grainY;
        this.stepX = arg0.stepX;
        this.stepY = arg0.stepY;
        this.depth = arg0.depth;
      }
    }
  }

  calculateSizeAtGreaterDepth(increase) {
    const { grainX, grainY, stepX, stepY } = this;
    let nextX = grainX;
    let nextY = grainY;
    while (increase-- > 0) {
      nextX = nextX * stepX;
      nextY = nextY * stepY;
    }
    return new Size(nextX, nextY).floor();
  }

  calculateSizeAtLesserDepth(decrease) {
    const { grainX, grainY, stepX, stepY } = this;
    let nextX = grainX;
    let nextY = grainY;
    const invertStepX = 1.0 / stepX;
    const invertStepY = 1.0 / stepY;
    while (decrease-- > 0) {
      nextX = nextX * invertStepX;
      nextY = nextY * invertStepY;
    }
    return new Size(nextX, nextY).floor();
  }

  calculateSizeAtDepth(depth) {
    return depth > this.depth
      ? this.calculateSizeAtGreaterDepth(depth - this.depth)
      : this.calculateSizeAtLesserDepth(this.depth - depth);
  }

  calculateBasePlan() {
    if (this.depth) {
      const { width, height } = this.calculateSizeAtLesserDepth(this.depth);
      return new DicePlan(width, height, this.stepX, this.stepY);
    }
    return new DicePlan(this);
  }

  calculatePlanAtGreaterDepth(increase) {
    if (increase < 0) {
      throw new Error('New depth should be greater than 0');
    }
    if (this.depth) {
      throw new Error('Derived plans should be created from a base plan (depth == 0)');
    }

    if (increase) {
      const { width, height } = this.calculateSizeAtGreaterDepth(increase);
      return new DicePlan(width, height, this.stepX, this.stepY, increase);
    }
    return new DicePlan(this);
  }

  calculatePlanAtLesserDepth(decrease) {
    if (decrease > this.depth) {
      throw new Error('New depth would be less than 0');
    }

    if (decrease) {
      const { width, height } = this.calculateSizeAtLesserDepth(decrease);
      return new DicePlan(width, height, this.stepX, this.stepY, this.depth - decrease);
    }
    return new DicePlan(this);
  }

  calculatePlanAtDepth(depth) {
    return depth > this.depth
      ? this.calculatePlanAtGreaterDepth(depth - this.depth)
      : this.calculatePlanAtLesserDepth(this.depth - depth);
  }

  createCompass(width, height, lapped = false) {
    if (width < 1) {
      throw new Error('width argument out of range');
    }
    if (height < 1) {
      throw new Error('height argument out of range');
    }

    return new ImageCompass(
      width,
      height,
      this.grainX,
      this.grainY,
      ImageCompassMode.normal,
      lapped,
    );
  }

  createCompassAtDepth(width, height, depth, lapped = false) {
    if (width < 1) {
      throw new Error('width argument out of range');
    }
    if (height < 1) {
      throw new Error('height argument out of range');
    }
    if (depth < 0) {
      throw new Error('depth argument out of range');
    }

    const plan = this.calculateBasePlan().calculatePlanAtGreaterDepth(depth);

    return new ImageCompass(
      width,
      height,
      plan.grainX,
      plan.grainY,
      ImageCompassMode.Normal,
      lapped,
    );
  }
}

export default DicePlan;
