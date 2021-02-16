import * as R from 'ramda';
import invariant from 'tiny-invariant';

import getDebugLog from '../debugLog';

const debug = getDebugLog('dataBehavior');

class DataBehavior {
  started = false;
  hiker;

  constructor(id, name, options) {
    this.id = id;
    this.name = name;
    this.options = { ...options };
  }

  getType() {
    return 'ActionBehavior';
  }

  get type() {
    return this.getType();
  }

  assertIsValid() {
    invariant(this.id, 'data behavior should have an id');
    invariant(this.hiker, 'data behavior should have a hiker');
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

  onLoad() {
    debug('onLoad');
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
        started: this.started,
      }),
    );
  }

  restore(objectFactory, stateMap, state) {
    this.id = state.id;
    this.name = state.name;
    this.started = state.started;
    this.onRestore(objectFactory, stateMap, state);
    this.assertIsValid();
  }

  start() {
    debug('start');
    this.assertStarted(false);
    this.onStart();
    this.started = true;
  }

  load() {
    debug('load');
    this.assertStarted();
    return this.onLoad();
  }

  end() {
    debug('end');
    this.assertStarted();
    this.onEnd();
  }

  assertStarted(expected = true) {
    if (this.started !== expected) {
      throw new Error(`data behavior ${expected ? 'not' : 'already'} started`);
    }
  }
}

export default DataBehavior;

export function mixDataBehavior(...args) {
  return R.compose(...args)(DataBehavior);
}
