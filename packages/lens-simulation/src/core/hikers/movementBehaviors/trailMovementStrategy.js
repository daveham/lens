// import invariant from 'tiny-invariant';
import Rectangle from '../../../basic/rectangle';
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

    // assertIsValid() {
    //   super.assertIsValid();
    // }

    createTrailState() {
      this.assertIsValid();
      const { hiker } = this.behavior.hikerStrategy;

      const trailState = hiker.trail.createTrailState();
      trailState.hiker = hiker;
      trailState.movementBehavior = this;
      hiker.trailState = trailState;
    }

    onSuspend(objectFactory, state) {
      const { hiker } = this.behavior.hikerStrategy;
      return {
        ...super.onSuspend(objectFactory, state),
        displacementScheme: this.displacementScheme,
        fixedDisplacement: this.fixedDisplacement,
        stepLimit: this.stepLimit,
        initialLocation: this.initialLocation,
        steps: this.steps,
        trailState: hiker.trailState ? hiker.trailState.suspend(objectFactory, state) : undefined,
      };
    }

    onRestore(objectFactory, stateMap, state) {
      if (this.behavior.started) {
        this.createTrailState();
      }

      super.onRestore(objectFactory, stateMap, state);
      this.displacementScheme = state.displacementScheme;
      this.fixedDisplacement = state.fixedDisplacement;
      this.stepLimit = state.stepLimit;
      this.initialLocation = state.initialLocation;
      this.steps = state.steps;

      if (state.trailState) {
        const { hiker } = this.behavior.hikerStrategy;
        hiker.trailState.restore(objectFactory, stateMap, state.trailState);
      }
    }

    updateHikerBounds() {
      const { hiker } = this.behavior.hikerStrategy;
      let bounds;
      const { trail, trailState } = hiker;

      switch (this.displacementScheme) {
        // case DisplacementScheme.fixed:
        case DisplacementScheme.grid:
          bounds = new Rectangle(trailState.location, trail.plan.grain);
          break;
        default:
          bounds = new Rectangle(trailState.location, trail.plan.grain);
        // case DisplacementScheme.size:
        // case DisplacementScheme.bounds:
      }
      hiker.bounds = bounds;
    }

    onStart() {
      debug('onStart');
      this.assertIsValid();

      this.createTrailState();
      this.steps = 0;

      const { trail, trailState } = this.behavior.hikerStrategy.hiker;

      switch (this.displacementScheme) {
        case DisplacementScheme.fixed:
          trailState.movement = this.fixedDisplacement;
          break;
        case DisplacementScheme.grid:
          trailState.movement = trail.plan.grain;
          break;
        // case DisplacementScheme.size:
        // case DisplacementScheme.bounds:
      }
      trailState.initialLocation = this.initialLocation;

      trail.initializeTrailState(trailState);
      this.updateHikerBounds();
    }

    onMove() {
      debug('onMove');
      this.assertIsValid();

      const { hiker } = this.behavior.hikerStrategy;
      const { trail, trailState } = hiker;

      if (this.stepLimit > 0 && this.steps >= this.stepLimit) {
        hiker.abort(HikerExitReason.reachedStepLimit);
      } else {
        trail.updateTrailState(trailState);
        this.updateHikerBounds();
        this.steps += 1;
      }
    }
  };

export default TrailMovementStrategyMixin;
