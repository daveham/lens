import * as R from 'ramda';
import invariant from 'tiny-invariant';

import getDebugLog from '../debugLog';
const debug = getDebugLog('dataBehavior');

export class NullDataBehaviorStrategy {
  behavior;

  constructor(options = {}) {
    debug('ctor', { options });
    this.options = { ...options };
  }

  getType() {
    return 'ActionBehavior';
  }

  assertIsValid() {
    invariant(this.behavior, 'behavior should be assigned to strategy');
    // invariant(this.behavior.hikerStrategy, 'hikerStrategy should be assigned to behavior');
    // invariant(this.behavior.hikerStrategy.hiker, 'hiker should be assigned to hikerStrategy');
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

  onLoad() {
    debug('onLoad');
    this.assertIsValid();
  }

  onEnd() {
    this.assertIsValid();
  }
}

export const mixDataBehaviorStrategy = (...args) => R.compose(...args)(NullDataBehaviorStrategy);

class DataBehavior {
  started = false;

  constructor(id, name, strategy) {
    this.id = id;
    this.name = name;
    this.strategy = strategy || new NullDataBehaviorStrategy();
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

  start() {
    debug('start');
    this.assertStarted(false);
    this.strategy.onStart();
    this.started = true;
  }

  load() {
    debug('load');
    this.assertStarted();
    return this.strategy.onLoad();
  }

  end() {
    debug('end');
    this.assertStarted();
    this.strategy.onEnd();
  }

  assertStarted(expected = true) {
    if (this.started !== expected) {
      throw new Error(`data behavior ${expected ? 'not' : 'already'} started`);
    }
  }
}

export default DataBehavior;
