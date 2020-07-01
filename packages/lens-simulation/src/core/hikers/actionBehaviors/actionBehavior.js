import * as R from 'ramda';

import getDebugLog from '../debugLog';
const debug = getDebugLog('actionBehavior');

const nullStrategy = {
  onStart() {},
  onAct() {
    this.onObserve();
    this.onInfer();
  },
  onObserve() {},
  onInfer() {},
  onEnd() {},
};
const withDefaults = R.mergeRight(nullStrategy);

class ActionBehavior {
  started = false;

  constructor(hiker, strategy = {}) {
    this.hiker = hiker;
    this.strategy = withDefaults(strategy);
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
    this.strategy.onAct();
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
