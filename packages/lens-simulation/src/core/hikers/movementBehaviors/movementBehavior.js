import invariant from 'tiny-invariant';
import * as R from 'ramda';
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
  }

  onSuspend(objectFactory, state) {
    debug('onSuspend');
    this.assertIsValid();

    return {
      ...state,
      options: this.options,
    };
  }

  onRestore(objectFactory, stateMap, state) {
    debug('onRestore');
    this.assertIsValid();

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

  restore(objectFactory, stateMap, state) {
    debug('restore');
    this.id = state.id;
    this.name = state.name;
    this.started = state.started;
    this.strategy.onRestore(objectFactory, stateMap, state);
  }

  suspend(objectFactory) {
    debug('suspend');
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
