import * as R from 'ramda';
import invariant from 'tiny-invariant';

import getDebugLog from '../debugLog';
const debug = getDebugLog('dataBehavior');

class NullDataBehaviorStrategy {
  onStart() {}

  // async?
  onLoad() {
    invariant(this.behavior, 'behavior should be assigned to strategy');
    debug('NullDataBehaviorStrategy onLoad', this.behavior.hiker.name);
    return Promise.resolve();
  }

  onEnd() {}
}

export const mixDataBehaviorStrategy = (...args) => R.compose(...args)(NullDataBehaviorStrategy);

class DataBehavior {
  started = false;

  constructor(hiker, strategy) {
    this.hiker = hiker;
    this.strategy = strategy || new NullDataBehaviorStrategy();
    this.strategy.behavior = this;
  }

  // async?
  start() {
    debug('start', this.hiker.name);
    this.assertStarted(false);
    this.strategy.onStart();
    this.started = true;
  }

  load() {
    debug('load', this.hiker.name);
    this.assertStarted();
    return this.strategy.onLoad();
  }

  end() {
    debug('end', this.hiker.name);
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
