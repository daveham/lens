import * as R from 'ramda';
import { HikerExitReason } from '../../constants';

import getDebugLog from '../debugLog';
const debug = getDebugLog('movementBehavior');

const nullStrategy = {
  onStart() {},
  onMove() {
    this.behavior.abort(HikerExitReason.reachedStepLimit);
  },
  onEnd() {},
};
const withDefaults = R.mergeRight(nullStrategy);

class MovementBehavior {
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

  move() {
    debug('move', this.hiker.name);
    this.assertStarted();
    this.strategy.onMove();
  }

  end() {
    debug('end', this.hiker.name);
    this.assertStarted();
    this.strategy.onEnd();
  }

  assertStarted(expected = true) {
    if (this.started !== expected) {
      throw new Error(`movement behavior ${expected ? 'not' : 'already'} started`);
    }
  }

  abort(reason) {
    debug('abort', { name: this.hiker.name, reason });
    this.hiker.abort(reason);
  }
}

export default MovementBehavior;
