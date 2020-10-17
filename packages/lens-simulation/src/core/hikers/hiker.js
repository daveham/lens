import co from 'co';
import * as R from 'ramda';

import getDebugLog from './debugLog';
const debug = getDebugLog('hiker');

export class NullHikerStrategy {
  hiker;
  dataBehavior;
  movementBehavior;
  actionBehavior;

  constructor(options = {}) {
    this.options = { ...options };
  }

  *runBehaviors() {
    debug('NullHikerStrategy:runBehaviors', { active: this.hiker.active });
    if (
      this.actionBehavior &&
      this.dataBehavior &&
      this.hiker.active &&
      this.actionBehavior.needsData()
    ) {
      // load data that subsequent behaviors might consume
      yield this.dataBehavior.load();
    }
    if (this.actionBehavior && this.hiker.active) {
      // take action based on current state (location and data)
      yield this.actionBehavior.act();
    }
    if (this.movementBehavior && this.hiker.active) {
      // move to the next location
      yield this.movementBehavior.move();
    }
  }

  onStart() {
    if (this.dataBehavior) {
      this.dataBehavior.start();
    }

    if (this.movementBehavior) {
      this.movementBehavior.start();
    }

    if (this.actionBehavior) {
      this.actionBehavior.start();
    }
  }

  onStep() {
    debug('NullHikerStrategy onStep', this.hiker.name);
    return co(this.runBehaviors());
  }

  onEnd() {
    if (this.dataBehavior) {
      this.dataBehavior.end();
    }

    if (this.movementBehavior) {
      this.movementBehavior.end();
    }

    if (this.actionBehavior) {
      this.actionBehavior.end();
    }
  }
}

export const mixHikerStrategy = (...args) => R.compose(...args)(NullHikerStrategy);

class Hiker {
  trail;
  active = true;
  exitReason = '';

  constructor(id, name, strategy) {
    this.id = id;
    this.name = name;
    this.strategy = strategy || new NullHikerStrategy();
    this.strategy.hiker = this;
  }

  initialize(trail) {
    this.trail = trail;
  }

  isActive() {
    return this.active;
  }

  step() {
    debug('step', this.name);
    if (!this.started) {
      this.strategy.onStart();
      this.started = true;
    }

    return this.strategy.onStep().then(() => {
      if (!this.active) {
        this.strategy.onEnd();
      }

      return this.isActive();
    });
  }

  abort(reason) {
    debug('abort', { reason });
    this.exitReason = reason;
    this.active = false;
  }
}

export default Hiker;
