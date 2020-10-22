import invariant from 'tiny-invariant';
import { HikerExitReason } from '../../constants';

import getDebugLog from '../debugLog';
const debug = getDebugLog('trailMovementStrategy');

export const DisplacementScheme = {
  fixed: 'fixed',
  grid: 'grid',
  size: 'size',
  bounds: 'bounds',
};

const TrailMovementStrategyMixin = superclass =>
  class extends superclass {
    trailState;
    steps;
    displacementScheme;

    constructor({
      displacementScheme,
      fixedDisplacement,
      stepLimit,
      initialLocation,
      ...other
    } = {}) {
      super(other);

      this.displacementScheme = displacementScheme || DisplacementScheme.fixed;
      this.fixedDisplacement = fixedDisplacement || [0, 0];
      this.stepLimit = stepLimit || 0;
      this.initialLocation = initialLocation;
    }

    onStart() {
      invariant(this.behavior.hikerStrategy.hiker, 'hiker should be assigned to movement strategy');
      invariant(this.behavior.hikerStrategy.hiker.trail, 'trail should be assigned to hiker');
      const { hiker } = this.behavior.hikerStrategy;
      debug('onStart', hiker.name);

      this.steps = 0;
      const { trail } = hiker;
      this.trailState = trail.createTrailState();
      this.trailState.hiker = hiker;
      this.trailState.movementBehavior = this;

      switch (this.displacementScheme) {
        case DisplacementScheme.fixed:
          this.trailState.movement = this.fixedDisplacement;
          break;
        case DisplacementScheme.grid:
          this.trailState.movement = trail.plan.grain;
          break;
        // case DisplacementScheme.size:
        // case DisplacementScheme.bounds:
      }
      this.trailState.initialLocation = this.initialLocation;

      trail.initializeTrailState(this.trailState);
    }

    // async?
    onMove() {
      invariant(this.behavior.hikerStrategy.hiker, 'hiker should be assigned to movement strategy');
      invariant(this.behavior.hikerStrategy.hiker.trail, 'trail should be assigned to hiker');
      const { hiker } = this.behavior.hikerStrategy;
      debug('onMove', hiker.name);

      if (this.stepLimit > 0 && this.steps >= this.stepLimit) {
        hiker.abort(HikerExitReason.reachedStepLimit);
      } else {
        hiker.trail.updateTrailState(this.trailState);
        this.steps += 1;
      }
      return Promise.resolve();
    }
  };

export default TrailMovementStrategyMixin;
