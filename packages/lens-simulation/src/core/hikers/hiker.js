import * as R from 'ramda';
import MovementBehavior from './movementBehaviors/movementBehavior';
import ActionBehavior from './actionBehaviors/actionBehavior';

import getDebugLog from './debugLog';
const debug = getDebugLog('hiker');

class NullHikerStrategy {
  onStart() {}

  onStep() {
    debug('NullHikerStrategy onStep', this.hiker.name);
    if (this.hiker.active) {
      this.hiker.actionBehavior.act();
    }
    if (this.hiker.active) {
      this.hiker.movementBehavior.move();
    }
  }

  onEnd() {}

  onCreateMovementBehavior() {
    debug('NullHikerStrategy onCreateMovementBehavior', this.hiker.name);
    return new MovementBehavior(this.hiker);
  }

  onCreateActionBehavior() {
    debug('NullHikerStrategy onCreateActionBehavior', this.hiker.name);
    return new ActionBehavior(this.hiker);
  }
}

export const mixHikerStrategy = (...args) => R.compose(...args)(NullHikerStrategy);

class Hiker {
  active = true;
  movementBehavior = null;
  actionBehavior = null;
  exitReason = '';

  constructor(id, name, trail, strategy) {
    this.id = id;
    this.name = name;
    this.trail = trail;
    this.strategy = strategy || new NullHikerStrategy();
    this.strategy.hiker = this;
  }

  isActive() {
    return this.active;
  }

  step() {
    debug('step', this.name);
    this.ensureBehaviorsCreated();
    if (!this.started) {
      this.strategy.onStart();
      this.started = true;
      this.movementBehavior.start();
      this.actionBehavior.start();
    }

    this.strategy.onStep();

    if (!this.active) {
      this.strategy.onEnd();
      this.movementBehavior.end();
      this.actionBehavior.end();
    }

    return this.isActive();
  }

  ensureBehaviorsCreated() {
    debug('ensureBehaviorsCreated', this.name);
    if (!this.movementBehavior || !this.actionBehavior) {
      this.movementBehavior = this.strategy.onCreateMovementBehavior();
      this.actionBehavior = this.strategy.onCreateActionBehavior();
    }
  }

  onStep() {
    if (this.active) {
      this.actionBehavior.act();
    }

    if (this.active) {
      this.movementBehavior.move();
    }
  }

  abort(reason) {
    debug('abort', { reason });
    this.exitReason = reason;
    this.active = false;
  }
}

export default Hiker;
