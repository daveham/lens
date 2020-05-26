import { HikerExitReason } from '../../constants';

import getDebugLog from '../debugLog';
const debug = getDebugLog('movementBehavior');

class MovementBehavior {
  hiker = null;
  started = false;

  constructor(hiker) {
    this.hiker = hiker;
  }

  start() {
    this.assertStarted(false);
    this.onStart();
    this.started = true;
  }

  move() {
    this.assertStarted(true);
    this.onMove();
  }

  end() {
    this.assertStarted(true);
    this.onEnd();
  }

  assertStarted(expected) {
    if (this.started !== expected) {
      throw new Error(`movement behavior ${expected ? 'not' : 'already'} started`);
    }
  }

  abort(reason) {
    this.hiker.abort(reason);
  }

  onStart() {
    debug('onStart');
  }

  onMove() {
    debug('onMove');
    this.abort(HikerExitReason.reachedStepLimit);
  }

  onEnd() {
    debug('onEnd');
  }
}

export default MovementBehavior;
