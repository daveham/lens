import invariant from 'tiny-invariant';
import * as R from 'ramda';
import { HikerExitReason } from '../../constants';

import getDebugLog from '../debugLog';
const debug = getDebugLog('movementBehavior');

class NullMovementBehaviorStrategy {
  onStart() {}

  onMove() {
    invariant(this.behavior, 'behavior should be assigned to strategy');
    debug('NullMovementBehaviorStrategy onMove', this.behavior.hiker.name);
    this.behavior.abort(HikerExitReason.reachedStepLimit);
  }

  onEnd() {}
}

export const mixMovementBehaviorStrategy = (...args) =>
  R.compose(...args)(NullMovementBehaviorStrategy);

class MovementBehavior {
  started = false;
  hiker;
  strategy;

  constructor(hiker, strategy) {
    this.hiker = hiker;
    this.strategy = strategy || new NullMovementBehaviorStrategy();
    this.strategy.behavior = this;
    this.strategy.hiker = hiker;
  }

  start() {
    debug('start', this.hiker.name);
    this.assertStarted(false);
    this.strategy.onStart();
    this.started = true;
  }

  move() {
    debug('move', this.hiker.name);
    this.assertStarted();
    this.strategy.onMove();
  }

  end() {
    debug('end', this.hiker.name);
    this.assertStarted();
    this.strategy.onEnd();
  }

  assertStarted(expected = true) {
    if (this.started !== expected) {
      throw new Error(`movement behavior ${expected ? 'not' : 'already'} started`);
    }
  }

  abort(reason) {
    debug('abort', { name: this.hiker.name, reason });
    this.hiker.abort(reason);
  }
}

export default MovementBehavior;
