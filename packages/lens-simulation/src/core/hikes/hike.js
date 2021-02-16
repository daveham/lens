import * as R from 'ramda';
import Rectangle from '../../basic/rectangle';
import Size from '../../basic/size';
import getDebugLog from './debugLog';
import invariant from 'tiny-invariant';
import { makeSuspendListKey } from '../factories/utils';

const debug = getDebugLog('hike');

const DEFAULT_RUN_AWAY_LIMIT = 1000;

class Hike {
  trails = [];
  stepCount;
  isOpen;
  stepRunAwayLimit = DEFAULT_RUN_AWAY_LIMIT;

  constructor(id, name, options = {}) {
    this.id = id;
    this.name = name;
    this.options = { ...options };
    this.stepCount = 0;
    this.isOpen = false;
  }

  get type() {
    return this.getType();
  }

  getType() {
    return 'Hike';
  }

  addTrail(trail) {
    this.trails.push(trail);
    trail.events.on('trailStateCreated', this.handleTrailStateCreated);
  }

  configure(size) {
    this.size = new Size(size);
    this.bounds = new Rectangle([0, 0], size);
  }

  assertIsValid() {
    invariant(this.id, 'hike should have an id');
  }

  onSuspend(objectFactory, state) {
    return {
      ...state,
      options: this.options,
    };
  }

  onRestore(objectFactory, stateMap, state) {
    this.options = state.options;
  }

  onOpen() {}

  onClose() {}

  suspend(suspendFactory) {
    this.assertIsValid();
    suspendFactory.suspendItem(
      this,
      this.onSuspend(suspendFactory, {
        type: this.type,
        id: this.id,
        name: this.name,
        size: this.size,
        bounds: this.bounds,
      }),
    );
    suspendFactory.suspendList('T', this, this.trails);
  }

  restore(objectFactory, stateMap, state) {
    this.id = state.id;
    this.name = state.name;
    this.size = state.size;
    this.bounds = state.bounds;
    this.onRestore(objectFactory, stateMap, state);

    const trailList = stateMap.get(makeSuspendListKey('T', this.id));
    if (trailList) {
      trailList.forEach(trailId =>
        this.addTrail(objectFactory.restoreTrail(this, trailId, stateMap)),
      );
    }
    this.assertIsValid();
  }

  handleHikerLocation = ({ hiker, location: { x, y } }) => {
    debug('handleHikerLocation', { hiker: hiker.name, x, y });
  };

  handleTrailStateCreated = ({ trailState }) => {
    trailState.events.on('location', this.handleHikerLocation);
  };

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
    this.onRun(step);
    if (!this.isActive()) {
      this.trails.forEach(trail => trail.close());
      this.close();
      this.isOpen = false;
    }
  }

  open() {
    debug('open');
    this.onOpen();
  }

  close() {
    debug('close');
    this.onClose();
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

export function mixHike(...args) {
  return R.compose(...args)(Hike);
}

export default Hike;
