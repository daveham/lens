import * as R from 'ramda';
import invariant from 'tiny-invariant';

import getDebugLog from '../debugLog';
const debug = getDebugLog('actionBehavior');

class NullActionBehaviorStrategy {
  trace() {}
  onStart() {}

  get label() {
    return this.behavior.label;
  }

  onNeedsData() {
    invariant(this.behavior, 'behavior should be assigned to strategy');
    invariant(this.behavior.hikerStrategy, 'hikerStrategy should be assigned to behavior');
    invariant(this.behavior.hikerStrategy.hiker, 'hiker should be assigned to hikerStrategy');
    debug('NullActionBehaviorStrategy onNeedsData', this.label);
    return false;
  }

  onAct() {
    invariant(this.behavior, 'behavior should be assigned to strategy');
    invariant(this.behavior.hikerStrategy, 'hikerStrategy should be assigned to behavior');
    invariant(this.behavior.hikerStrategy.hiker, 'hiker should be assigned to hikerStrategy');
    debug('NullActionBehaviorStrategy onAct', this.label);
    return this.onObserve().then(() => this.onInfer());
  }

  onObserve() {
    debug('NullActionBehaviorStrategy onObserve', this.label);
    return Promise.resolve();
  }

  onInfer() {
    debug('NullActionBehaviorStrategy onInfer', this.label);
    return Promise.resolve();
  }

  onEnd() {}
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
    return this.strategy.onAct();
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
