import * as R from 'ramda';
import invariant from 'tiny-invariant';

import getDebugLog from './debugLog';

const debug = getDebugLog('hiker');

class Hiker {
  trail;
  active = true;
  exitReason = '';

  constructor(id, name, options) {
    this.id = id;
    this.name = name;
    this.options = { ...options };
  }

  get type() {
    return this.getType();
  }

  getType() {
    return 'Hiker';
  }

  assertIsValid() {
    invariant(this.id, 'hiker should have an id');
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

  suspend(objectFactory) {
    this.assertIsValid();
    objectFactory.suspendItem(
      this,
      this.onSuspend(objectFactory, {
        type: this.type,
        id: this.id,
        name: this.name,
      }),
    );
  }

  restore(objectFactory, stateMap, state) {
    this.id = state.id;
    this.name = state.name;
    this.onRestore(objectFactory, stateMap, state);
    this.assertIsValid();
  }

  isActive() {
    debug('isActive', { active: this.active, reason: this.exitReason });
    return this.active;
  }

  step() {
    debug('step', this.name);
    if (!this.started) {
      this.onStart();
      this.started = true;
    }

    this.onStep();

    if (!this.isActive()) {
      this.onEnd();
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

export function mixHiker(...args) {
  return R.compose(...args)(Hiker);
}
