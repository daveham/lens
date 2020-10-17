import invariant from 'tiny-invariant';
import * as R from 'ramda';
import { HikerExitReason } from '../../constants';

import getDebugLog from '../debugLog';
const debug = getDebugLog('movementBehavior');

class NullMovementBehaviorStrategy {
  constructor(options = {}) {
    this.options = { ...options };
  }

  onStart() {}

  onMove() {
    invariant(this.behavior, 'behavior should be assigned to strategy');
    invariant(this.behavior.hikerStrategy, 'hikerStrategy should be assigned to behavior');
    invariant(this.behavior.hikerStrategy.hiker, 'hiker should be assigned to hikerStrategy');
    debug('NullMovementBehaviorStrategy onMove', this.behavior.hikerStrategy.hiker.name);
    this.behavior.abort(HikerExitReason.reachedStepLimit);
    return Promise.resolve();
  }

  onEnd() {}
}

export const mixMovementBehaviorStrategy = (...args) =>
  R.compose(...args)(NullMovementBehaviorStrategy);

class MovementBehavior {
  started = false;
  hikerStrategy;
  strategy;

  constructor(id, name, strategy) {
    this.id = id;
    this.name = name;
    this.strategy = strategy || new NullMovementBehaviorStrategy();
    this.strategy.behavior = this;
  }

  start() {
    debug('start', this.hikerStrategy.hiker.name);
    this.assertStarted(false);
    this.strategy.onStart();
    this.started = true;
  }

  move() {
    debug('move', this.hikerStrategy.hiker.name);
    this.assertStarted();
    return this.strategy.onMove();
  }

  end() {
    debug('end', this.hikerStrategy.hiker.name);
    this.assertStarted();
    this.strategy.onEnd();
  }

  assertStarted(expected = true) {
    if (this.started !== expected) {
      throw new Error(`movement behavior ${expected ? 'not' : 'already'} started`);
    }
  }

  abort(reason) {
    debug('abort', { name: this.hikerStrategy.hiker.name, reason });
    this.hikerStrategy.hiker.abort(reason);
  }
}

export default MovementBehavior;
