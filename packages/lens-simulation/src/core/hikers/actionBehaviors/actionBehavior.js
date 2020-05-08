import getDebugLog from '../debugLog';
const debug = getDebugLog('actionBehavior');

class ActionBehavior {
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

  act() {
    this.assertStarted(true);
    this.onAct();
  }

  end() {
    this.assertStarted(true);
    this.onEnd();
  }

  assertStarted(expected) {
    if (this.started !== expected) {
      throw new Error(`action behavior ${expected ? 'not' : 'already'} started`);
    }
  }

  abort(reason) {
    this.hiker.abort(reason);
  }

  onStart() {
    debug('onStart');
  }

  onAct() {
    debug('onAct');
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
    debug('onEnd');
  }
}

export default ActionBehavior;
