import * as R from 'ramda';
import invariant from 'tiny-invariant';

import getDebugLog from '../debugLog';
const debug = getDebugLog('actionBehavior');

export class NullActionBehaviorStrategy {
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
    return {
      ...state,
      options: this.options,
    };
  }

  onRestore(objectFactory, stateMap, state) {
    this.options = state.options;
  }

  trace() {}

  onStart() {
    this.assertIsValid();
  }

  get label() {
    return this.behavior.label;
  }

  onNeedsData() {
    debug('onNeedsData');
    this.assertIsValid();

    return false;
  }

  onAct() {
    debug('onAct');
    this.assertIsValid();

    this.onObserve();
    this.onInfer();
  }

  onObserve() {
    debug('onObserve');
  }

  onInfer() {
    debug('onInfer');
  }

  onEnd() {
    this.assertIsValid();
  }
}

export const mixActionBehaviorStrategy = (...args) =>
  R.compose(...args)(NullActionBehaviorStrategy);

class ActionBehavior {
  started = false;
  hikerStrategy;
  strategy;

  constructor(id, name, strategy) {
    this.id = id;
    this.name = name;
    this.strategy = strategy || new NullActionBehaviorStrategy();
    this.strategy.behavior = this;
  }

  assertIsValid() {
    invariant(this.id, 'action behavior should have an id');
    invariant(this.strategy, 'action behavior should have a strategy');
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

  get label() {
    return this.hikerStrategy.hiker.name;
  }

  start() {
    debug('start', this.label);
    this.assertStarted(false);
    this.strategy.onStart();
    this.started = true;
  }

  needsData() {
    debug('needsData', this.label);
    this.assertStarted();
    return this.strategy.onNeedsData();
  }

  act() {
    debug('act', this.label);
    this.assertStarted();
    this.strategy.onAct();
  }

  end() {
    debug('end', this.label);
    this.assertStarted();
    this.strategy.onEnd();
  }

  assertStarted(expected = true) {
    if (this.started !== expected) {
      throw new Error(`action behavior ${expected ? 'not' : 'already'} started`);
    }
  }

  abort(reason) {
    debug('abort', this.label);
    this.hikerStrategy.hiker.abort(reason);
  }
}

export default ActionBehavior;
