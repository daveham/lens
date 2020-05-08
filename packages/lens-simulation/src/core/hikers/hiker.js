import MovementBehavior from './movementBehaviors/movementBehavior';
import ActionBehavior from './actionBehaviors/actionBehavior';

import getDebugLog from './debugLog';
const debug = getDebugLog('hiker');

class Hiker {
  trail = null;
  active = true;
  movementBehavior = null;
  actionBehavior = null;
  exitReason = '';

  constructor(trail) {
    this.trail = trail;
  }

  isActive() {
    return this.active;
  }

  step() {
    if (!(this.movementBehavior && this.movementBehavior.started)) {
      this.onStart();
      this.movementBehavior.start();
      this.actionBehavior.start();
    }

    this.onStep();

    if (!this.active) {
      this.onEnd();
      this.movementBehavior.end();
      this.actionBehavior.end();
    }

    return this.isActive();
  }

  onStep() {
    if (this.active) {
      this.actionBehavior.act();
    }

    if (this.active) {
      this.movementBehavior.move();
    }
  }

  onStart() {
    debug('onStart');
    this.started = true;
    this.movementBehavior = this.onCreateMovementBehavior();
    this.actionBehavior = this.onCreateActionBehavior();
  }

  onEnd() {
    debug('onEnd');
  }

  onCreateMovementBehavior() {
    debug('onCreateMovementBehavior');
    return new MovementBehavior(this);
  }

  onCreateActionBehavior() {
    debug('onCreateActionBehavior');
    return new ActionBehavior(this);
  }

  abort(reason) {
    debug('abort', { reason });
    this.exitReason = reason;
    this.active = false;
  }
}

export default Hiker;
