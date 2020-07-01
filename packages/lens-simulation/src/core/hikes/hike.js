import * as R from 'ramda';
import getDebugLog from './debugLog';
const debug = getDebugLog('hike');

const DEFAULT_RUN_AWAY_LIMIT = 10000;

const nullStrategy = {
  onOpen() {},
  onClose() {},
  onRun() {
    this.hike.onRun();
  },
};
const withDefaults = R.mergeRight(nullStrategy);

class Hike {
  trails = [];
  stepCount = 0;
  stepRunAwayLimit = DEFAULT_RUN_AWAY_LIMIT;

  constructor(id, name, size, strategy = {}) {
    this.id = id;
    this.name = name;
    this.size = size;
    this.strategy = withDefaults(strategy);
    this.strategy.hike = this;
  }

  addTrail(trail) {
    this.trails.push(trail);
  }

  run() {
    debug('run', this.name);
    this.open();
    this.trails.forEach(trail => trail.open());
    this.strategy.onRun();
    this.trails.forEach(trail => trail.close());
    this.close();
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

  onRun() {
    debug('onRun', { name: this.name });
    const { stepRunAwayLimit } = this;
    let anyActive = true;
    while (anyActive && this.stepCount < stepRunAwayLimit) {
      anyActive = false;
      for (const k of this.activeHikers()) {
        k.step();
        this.stepCount += 1;
        if (k.isActive()) {
          anyActive = true;
        }
      }
    }
  }
}

export default Hike;
