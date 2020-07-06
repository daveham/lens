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
    hiker;
    trailState;
    steps;

    constructor(options = {}) {
      super(options);

      this.displacementScheme = options.displacementScheme || DisplacementScheme.fixed;
      this.fixedDisplacement = options.fixedDisplacement || [0, 0];
      this.stepLimit = options.stepLimit || 0;
      this.initialLocation = options.initialLocation;
    }

    onStart() {
      invariant(this.hiker, 'hiker should be assigned to movement strategy');
      invariant(this.hiker.trail, 'trail should be assigned to hiker');
      debug('onStart', this.hiker.name);

      this.steps = 0;
      const { trail } = this.hiker;
      this.trailState = trail.createTrailState();
      this.trailState.hiker = this.hiker;
      this.trailState.movementBehavior = this;

      switch (this.displacementScheme) {
        case DisplacementScheme.fixed:
          this.trailState.movement = this.fixedDisplacement;
          break;
        case DisplacementScheme.grid:
          this.trailState.movement = trail.plan.grain;
          break;
      }
      this.trailState.initialLocation = this.initialLocation;

      trail.initializeTrailState(this.trailState);
    }

    onMove() {
      invariant(this.hiker, 'hiker should be assigned to movement strategy');
      invariant(this.hiker.trail, 'trail should be assigned to hiker');
      debug('onMove', this.hiker.name);

      if (this.stepLimit > 0 && this.steps >= this.stepLimit) {
        this.hiker.abort(HikerExitReason.reachedStepLimit);
      } else {
        this.hiker.trail.updateTrailState(this.trailState);
        this.steps += 1;
      }
    }
  };

export default TrailMovementStrategyMixin;
