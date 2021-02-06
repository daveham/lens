// import invariant from 'tiny-invariant';
import { buildType } from '../utils';

import getDebugLog from './debugLog';

const debug = getDebugLog('trailHikerStrategy');

const TrailHikerStrategyMixin = superclass =>
  class extends superclass {
    dataBehavior;
    actionBehavior;
    movementBehavior;

    getType() {
      return buildType(super.getType(), 'Trail');
    }

    assertIsValid() {
      super.assertIsValid();

      if (this.dataBehavior) {
        this.dataBehavior.assertIsValid();
      }

      if (this.actionBehavior) {
        this.actionBehavior.assertIsValid();
      }

      if (this.movementBehavior) {
        this.movementBehavior.assertIsValid();
      }
    }

    onSuspend(objectFactory, state) {
      if (this.dataBehavior) {
        this.dataBehavior.suspend(objectFactory);
      }
      if (this.movementBehavior) {
        this.movementBehavior.suspend(objectFactory);
      }
      if (this.actionBehavior) {
        this.actionBehavior.suspend(objectFactory);
      }
      return {
        ...super.onSuspend(objectFactory, state),
        dataBehaviorId: this.dataBehavior && this.dataBehavior.id,
        movementBehaviorId: this.movementBehavior && this.movementBehavior.id,
        actionBehaviorId: this.actionBehavior && this.actionBehavior.id,
      };
    }

    onRestore(objectFactory, stateMap, state) {
      objectFactory.restoreTrailHikerBehaviors(this, stateMap, state);
    }

    onStart() {
      debug('onStart');
      super.onStart();

      if (this.dataBehavior) {
        this.dataBehavior.start();
      }

      if (this.actionBehavior) {
        this.actionBehavior.start();
      }

      if (this.movementBehavior) {
        this.movementBehavior.start();
      }
    }

    onStep() {
      debug('onStep');
      super.onStep();

      if (this.actionBehavior && this.hiker.active) {
        // take action based on current state (location and data)
        this.actionBehavior.act();
      }
      if (this.movementBehavior && this.hiker.active) {
        // move to the next location
        this.movementBehavior.move();
      }
    }

    onEnd() {
      debug('onEnd');
      super.onEnd();

      if (this.dataBehavior) {
        this.dataBehavior.end();
      }

      if (this.actionBehavior) {
        this.actionBehavior.end();
      }

      if (this.movementBehavior) {
        this.movementBehavior.end();
      }
    }
  };

export default TrailHikerStrategyMixin;
