import * as R from 'ramda';
import invariant from 'tiny-invariant';

import getDebugLog from '../debugLog';
const debug = getDebugLog('actionBehavior');

class NullActionBehaviorStrategy {
  onStart() {}

  onAct() {
    invariant(this.behavior, 'behavior should be assigned to strategy');
    debug('NullActionBehaviorStrategy onAct', this.behavior.hiker.name);
    return this.onObserve().then(() => this.onInfer());
  }

  onObserve() {
    debug('NullActionBehaviorStrategy onObserve', this.behavior.hiker.name);
    return Promise.resolve();
  }

  onInfer() {
    debug('NullActionBehaviorStrategy onInfer', this.behavior.hiker.name);
    return Promise.resolve();
  }

  onEnd() {}
}

export const mixActionBehaviorStrategy = (...args) =>
  R.compose(...args)(NullActionBehaviorStrategy);

class ActionBehavior {
  started = false;

  constructor(hiker, strategy) {
    this.hiker = hiker;
    this.strategy = strategy || new NullActionBehaviorStrategy();
    this.strategy.behavior = this;
  }

  start() {
    debug('start', this.hiker.name);
    this.assertStarted(false);
    this.strategy.onStart();
    this.started = true;
  }

  act() {
    debug('act', this.hiker.name);
    this.assertStarted();
    return this.strategy.onAct();
  }

  end() {
    debug('end', this.hiker.name);
    this.assertStarted();
    this.strategy.onEnd();
  }

  assertStarted(expected = true) {
    if (this.started !== expected) {
      throw new Error(`action behavior ${expected ? 'not' : 'already'} started`);
    }
  }

  abort(reason) {
    debug('abort', { name: this.hiker.name, reason });
    this.hiker.abort(reason);
  }
}

export default ActionBehavior;
