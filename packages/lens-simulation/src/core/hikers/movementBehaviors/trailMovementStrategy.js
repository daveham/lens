import invariant from 'tiny-invariant';
import { HikerExitReason } from '../../constants';
import { buildType } from '../../utils';

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

    getType() {
      return buildType(super.getType(), 'Trail');
    }

    assertIsValid() {
      invariant(this.behavior.hikerStrategy.hiker, 'hiker should be assigned to movement strategy');
      invariant(this.behavior.hikerStrategy.hiker.trail, 'trail should be assigned to hiker');
    }

    createTrailState() {
      this.assertIsValid();
      const { hiker } = this.behavior.hikerStrategy;

      this.trailState = hiker.trail.createTrailState();
      this.trailState.hiker = hiker;
      this.trailState.movementBehavior = this;
    }

    onSuspend(objectFactory, state) {
      debug('onSuspend');
      this.assertIsValid();

      return {
        ...super.onSuspend(objectFactory, state),
        displacementScheme: this.displacementScheme,
        fixedDisplacement: this.fixedDisplacement,
        stepLimit: this.stepLimit,
        initialLocation: this.initialLocation,
        steps: this.steps,
        trailState: this.trailState ? this.trailState.suspend(objectFactory, state) : undefined,
      };
    }

    onRestore(objectFactory, stateMap, state) {
      debug('onRestore');

      this.createTrailState();

      super.onRestore(objectFactory, stateMap, state);
      this.displacementScheme = state.displacementScheme;
      this.fixedDisplacement = state.fixedDisplacement;
      this.stepLimit = state.stepLimit;
      this.initialLocation = state.initialLocation;
      this.steps = state.steps;

      if (state.trailState) {
        this.trailState.restore(objectFactory, stateMap, state.trailState);
      }
    }

    onStart() {
      debug('onStart');
      this.assertIsValid();

      this.createTrailState();
      this.steps = 0;

      const { trail } = this.behavior.hikerStrategy.hiker;

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

    onMove() {
      debug('onMove');
      this.assertIsValid();

      const { hiker } = this.behavior.hikerStrategy;

      if (this.stepLimit > 0 && this.steps >= this.stepLimit) {
        hiker.abort(HikerExitReason.reachedStepLimit);
      } else {
        hiker.trail.updateTrailState(this.trailState);
        this.steps += 1;
      }
    }
  };

export default TrailMovementStrategyMixin;
