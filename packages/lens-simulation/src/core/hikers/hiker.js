import * as R from 'ramda';
import invariant from 'tiny-invariant';

import getDebugLog from './debugLog';

const debug = getDebugLog('hiker');

export class BaseHikerStrategy {
  hiker;

  constructor(options = {}) {
    this.options = { ...options };
  }

  getType() {
    return 'Hiker';
  }

  assertIsValid() {
    invariant(this.hiker, 'hiker should be assigned to hiker strategy');
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

  onStep() {
    this.assertIsValid();
  }

  onEnd() {
    this.assertIsValid();
  }
}

export const mixHikerStrategy = (...args) => R.compose(...args)(BaseHikerStrategy);

class Hiker {
  trail;
  active = true;
  exitReason = '';

  constructor(id, name, strategy) {
    this.id = id;
    this.name = name;
    this.strategy = strategy || new BaseHikerStrategy();
    this.strategy.hiker = this;
  }

  assertIsValid() {
    invariant(this.id, 'hiker should have an id');
    invariant(this.strategy, 'hiker should have a strategy');
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
      }),
    );
  }

  restore(objectFactory, stateMap, state) {
    this.id = state.id;
    this.name = state.name;
    this.strategy.onRestore(objectFactory, stateMap, state);
    this.assertIsValid();
  }

  isActive() {
    debug('isActive', { active: this.active, reason: this.exitReason });
    return this.active;
  }

  step() {
    debug('step', this.name);
    if (!this.started) {
      this.strategy.onStart();
      this.started = true;
    }

    this.strategy.onStep();

    if (!this.active) {
      this.strategy.onEnd();
    }

    return this.isActive();
  }

  abort(reason) {
    debug('abort', { reason });
    this.exitReason = reason;
    this.active = false;
  }
}

export default Hiker;
