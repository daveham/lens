import invariant from 'tiny-invariant';
import { buildType } from '../utils';

import getDebugLog from './debugLog';
const debug = getDebugLog('trailHikerStrategy');

const TrailHikerStrategyMixin = superclass =>
  class extends superclass {
    dataBehavior;
    movementBehavior;
    actionBehavior;

    getType() {
      return buildType(super.getType(), 'Trail');
    }

    assertIsValid() {
      invariant(this.hiker, 'hiker should be assigned to strategy');
    }

    onSuspend(objectFactory, state) {
      debug('onSuspend');
      this.assertIsValid();

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
      debug('onRestore');
      this.assertIsValid();

      objectFactory.restoreTrailHikerBehaviors(this, stateMap, state);
    }

    onStart() {
      debug('onStart');
      this.assertIsValid();

      if (this.dataBehavior) {
        this.dataBehavior.start();
      }

      if (this.movementBehavior) {
        this.movementBehavior.start();
      }

      if (this.actionBehavior) {
        this.actionBehavior.start();
      }
    }

    onStep() {
      debug('onStep');
      this.assertIsValid();

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
      this.assertIsValid();

      if (this.dataBehavior) {
        this.dataBehavior.end();
      }

      if (this.movementBehavior) {
        this.movementBehavior.end();
      }

      if (this.actionBehavior) {
        this.actionBehavior.end();
      }
    }
  };

export default TrailHikerStrategyMixin;
