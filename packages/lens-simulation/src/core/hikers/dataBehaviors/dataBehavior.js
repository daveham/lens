import * as R from 'ramda';
import invariant from 'tiny-invariant';

import getDebugLog from '../debugLog';

const debug = getDebugLog('dataBehavior');

export class BaseDataBehaviorStrategy {
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
}

export function mixDataBehaviorStrategy(...args) {
  return R.compose(...args)(BaseDataBehaviorStrategy);
}

class DataBehavior {
  started = false;
  hikerStrategy;
  strategy;

  constructor(id, name, strategy) {
    this.id = id;
    this.name = name;
    this.strategy = strategy || new BaseDataBehaviorStrategy();
    this.strategy.behavior = this;
  }

  get type() {
    return this.strategy.getType();
  }

  assertIsValid() {
    invariant(this.id, 'data behavior should have an id');
    invariant(this.strategy, 'data behavior should have a strategy');
    invariant(this.hikerStrategy, 'data behavior should have a hiker strategy');
    invariant(this.hikerStrategy.hiker, 'data behavior strategy should have a hiker');
    this.strategy.assertIsValid();
  }

  suspend(objectFactory) {
    this.assertIsValid();
    objectFactory.suspendItem(
      this,
      this.strategy.onSuspend(objectFactory, {
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
    this.strategy.onRestore(objectFactory, stateMap, state);
    this.assertIsValid();
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
