import co from 'co';
import * as R from 'ramda';
import DataBehavior from './dataBehaviors/dataBehavior';
import MovementBehavior from './movementBehaviors/movementBehavior';
import ActionBehavior from './actionBehaviors/actionBehavior';

import getDebugLog from './debugLog';
const debug = getDebugLog('hiker');

class NullHikerStrategy {
  hiker;

  onStart() {}

  onStep() {
    debug('NullHikerStrategy onStep', this.hiker.name);
    return this.hiker.onStep();
  }

  onEnd() {}

  onCreateDataBehavior() {
    debug('NullHikerStrategy onCreateDataBehavior', this.hiker.name);
    return new DataBehavior(this.hiker);
  }

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
  dataBehavior;
  movementBehavior;
  actionBehavior;
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
      this.dataBehavior.start();
      this.movementBehavior.start();
      this.actionBehavior.start();
    }

    return this.strategy.onStep().then(() => {
      if (!this.active) {
        this.strategy.onEnd();
        this.dataBehavior.end();
        this.movementBehavior.end();
        this.actionBehavior.end();
      }

      return this.isActive();
    });
  }

  ensureBehaviorsCreated() {
    debug('ensureBehaviorsCreated', this.name);
    if (!this.dataBehavior || !this.movementBehavior || !this.actionBehavior) {
      this.dataBehavior = this.strategy.onCreateDataBehavior();
      this.movementBehavior = this.strategy.onCreateMovementBehavior();
      this.actionBehavior = this.strategy.onCreateActionBehavior();
    }
  }

  *runBehaviors() {
    debug('runBehaviors', { active: this.active });
    if (this.active) {
      yield this.dataBehavior.load();
    }
    if (this.active) {
      yield this.actionBehavior.act();
    }
    if (this.active) {
      yield this.movementBehavior.move();
    }
  }

  onStep() {
    return co(this.runBehaviors());
  }

  abort(reason) {
    debug('abort', { reason });
    this.exitReason = reason;
    this.active = false;
  }
}

export default Hiker;
