import * as R from 'ramda';
import invariant from 'tiny-invariant';
import { HikerExitReason } from '../../constants';

import getDebugLog from '../debugLog';

const debug = getDebugLog('movementBehavior');

export class NullMovementBehaviorStrategy {
  behavior;

  constructor(options = {}) {
    debug('ctor', { options });
    this.options = { ...options };
  }

  getType() {
    return 'MovementBehavior';
  }

  assertIsValid() {
    invariant(this.behavior, 'behavior should be assigned to strategy');
    invariant(this.behavior.hikerStrategy.hiker, 'hiker should be assigned to movement strategy');
    invariant(this.behavior.hikerStrategy.hiker.trail, 'trail should be assigned to hiker');
  }

  onSuspend(objectFactory, state) {
    return {
      ...state,
      options: this.options,
    };
  }

  onRestore(objectFactory, stateMap, state) {
    this.options = state.options;
  }

  onStart() {
    this.assertIsValid();
  }

  onMove() {
    debug('onMove');
    this.assertIsValid();

    this.behavior.abort(HikerExitReason.reachedStepLimit);
  }

  onEnd() {
    this.assertIsValid();
  }
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

  assertIsValid() {
    invariant(this.id, 'movement behavior should have an id');
    invariant(this.strategy, 'movement behavior should have a strategy');
    this.strategy.assertIsValid();
  }

  suspend(objectFactory) {
    this.assertIsValid();
    objectFactory.suspendItem(
      this,
      this.strategy.onSuspend(objectFactory, {
        type: this.strategy.getType(),
        id: this.id,
        name: this.name,
        started: this.started,
      }),
    );
  }

  restore(objectFactory, stateMap, state) {
    this.id = state.id;
    this.name = state.name;
    this.started = state.started;
    this.strategy.onRestore(objectFactory, stateMap, state);
    this.assertIsValid();
  }

  assertStarted(expected = true) {
    if (this.started !== expected) {
      throw new Error(`movement behavior ${expected ? 'not' : 'already'} started`);
    }
  }

  start() {
    debug('start');
    this.assertStarted(false);
    this.strategy.onStart();
    this.started = true;
  }

  move() {
    debug('move');
    this.assertStarted();
    return this.strategy.onMove();
  }

  end() {
    debug('end');
    this.assertStarted();
    this.strategy.onEnd();
  }

  abort(reason) {
    debug('abort', { name: this.hikerStrategy.hiker.name, reason });
    this.hikerStrategy.hiker.abort(reason);
  }
}

export default MovementBehavior;
