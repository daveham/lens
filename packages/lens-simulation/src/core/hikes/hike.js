import co from 'co';
import * as R from 'ramda';
import Rectangle from '../../basic/rectangle';
import Size from '../../basic/size';
import getDebugLog from './debugLog';
const debug = getDebugLog('hike');

const DEFAULT_RUN_AWAY_LIMIT = 10000;

export class NullHikeStrategy {
  constructor(options = {}) {
    this.options = { ...options };
  }

  onOpen() {}

  onClose() {}

  onRun() {
    debug('NullHikeStrategy run', this.hike.name);
    return this.hike.onRun();
  }
}

export const mixHikeStrategy = (...args) => R.compose(...args)(NullHikeStrategy);

class Hike {
  trails = [];
  stepCount = 0;
  stepRunAwayLimit = DEFAULT_RUN_AWAY_LIMIT;

  constructor(id, name, size, strategy) {
    this.id = id;
    this.name = name;
    this.size = new Size(size);
    this.bounds = new Rectangle([0, 0], size);
    this.strategy = strategy || new NullHikeStrategy();
    this.strategy.hike = this;
  }

  addTrail(trail) {
    debug('addTrail', this.name);
    this.trails.push(trail);
  }

  run() {
    debug('run', this.name);
    this.open();
    this.trails.forEach(trail => trail.open());
    return this.strategy.onRun().then(() => {
      this.trails.forEach(trail => trail.close());
      this.close();
    });
  }

  open() {
    debug('open', this.name);
    this.stepCount = 0;
    this.strategy.onOpen();
  }

  close() {
    debug('close', this.name);
    this.strategy.onClose();
  }

  *activeHikers() {
    for (const t of this.trails) {
      for (const k of t.hikers) {
        if (k.isActive) {
          yield k;
        }
      }
    }
  }

  *runSteps() {
    const { stepRunAwayLimit } = this;
    let anyActive = true;
    while (anyActive && this.stepCount < stepRunAwayLimit) {
      anyActive = false;
      for (const k of this.activeHikers()) {
        yield k.step();
        this.stepCount += 1;
        debug('runSteps', { stepCount: this.stepCount, active: k.isActive() });
        if (k.isActive()) {
          anyActive = true;
        }
      }
    }
  }

  onRun() {
    debug('onRun', { name: this.name });
    return co(this.runSteps()).then(() => {
      debug('after onRun co');
    });
  }

  isLocationInBounds(location) {
    debug('isLocationInBounds', { bound: this.bounds.toString(), location: location.toString() });
    return this.bounds.containsPoint(location);
  }
}

export default Hike;
