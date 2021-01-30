import invariant from 'tiny-invariant';
import * as R from 'ramda';
import Rectangle from '../../basic/rectangle';
import Size from '../../basic/size';
import { makeSuspendListKey } from '../factories/utils';
import getDebugLog from './debugLog';
const debug = getDebugLog('hike');

const DEFAULT_RUN_AWAY_LIMIT = 1000;

export class NullHikeStrategy {
  hike;

  constructor(options = {}) {
    debug('NullHikeStrategy ctor', { options });
    this.options = { ...options };
  }

  getType() {
    return 'Hike';
  }

  assertIsValid() {
    invariant(this.hike, 'hike should be assigned to hike strategy');
  }

  onSuspend(objectFactory, state) {
    debug('onSuspend');
    this.assertIsValid();

    return {
      ...state,
      options: this.options,
    };
  }

  onRestore(objectFactory, stateMap, state) {
    debug('onRestore');
    this.assertIsValid();

    this.options = state.options;
  }

  onOpen() {}

  onClose() {}

  onRun(step) {
    debug('onRun');
    this.assertIsValid();

    return this.hike.onRun(step);
  }
}

export const mixHikeStrategy = (...args) => R.compose(...args)(NullHikeStrategy);

class Hike {
  trails = [];
  stepCount;
  isOpen;
  stepRunAwayLimit = DEFAULT_RUN_AWAY_LIMIT;

  constructor(id, name, strategy) {
    this.id = id;
    this.name = name;
    this.strategy = strategy || new NullHikeStrategy();
    this.strategy.hike = this;
    this.stepCount = 0;
    this.isOpen = false;
  }

  addTrail(trail) {
    debug('addTrail');
    this.trails.push(trail);
  }

  configure(size) {
    debug('configure', { size });
    this.size = new Size(size);
    this.bounds = new Rectangle([0, 0], size);
  }

  restore(objectFactory, stateMap, state) {
    debug('restore');
    const myState = state || stateMap.get(this.id);
    this.id = myState.id;
    this.name = myState.name;
    this.size = myState.size;
    this.bounds = myState.bounds;
    this.strategy.onRestore(objectFactory, stateMap, myState);

    const trailList = stateMap.get(makeSuspendListKey('T', this.id));
    if (trailList) {
      trailList.forEach(trailId =>
        this.addTrail(objectFactory.restoreTrail(this, trailId, stateMap)),
      );
    }
  }

  suspend(suspendFactory) {
    debug('suspend');
    suspendFactory.suspendItem(
      this,
      this.strategy.onSuspend(suspendFactory, {
        type: this.strategy.getType(),
        id: this.id,
        name: this.name,
        size: this.size,
        bounds: this.bounds,
      }),
    );
    suspendFactory.suspendList('T', this, this.trails);
  }

  isActive() {
    return this.trails.some(t => t.isActive());
  }

  run(step) {
    debug('run', this.name, step);
    this.stepCount = step;
    if (!this.isOpen && this.isActive()) {
      this.open();
      this.trails.forEach(trail => trail.open());
      this.isOpen = true;
    }
    this.strategy.onRun(step);
    if (!this.isActive()) {
      this.trails.forEach(trail => trail.close());
      this.close();
      this.isOpen = false;
    }
  }

  open() {
    debug('open');
    this.strategy.onOpen();
  }

  close() {
    debug('close');
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

  onRun(step) {
    debug('onRun');
    if (step < this.stepRunAwayLimit) {
      for (const k of this.activeHikers()) {
        k.step();
      }
    }
  }

  isLocationInBounds(location) {
    debug('isLocationInBounds', { bound: this.bounds.toString(), location: location.toString() });
    return this.bounds.containsPoint(location);
  }
}

export default Hike;
