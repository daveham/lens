import * as R from 'ramda';
import TrailState from './trailState';

import getDebugLog from './debugLog';
const debug = getDebugLog('trail');

const nullStrategy = {
  onOpen() {},
  onClose() {},
  onCreateTrailState() {
    return new TrailState();
  },
  onInitializeTrailState() {},
  onUpdateTrailState() {},
};
const withDefaults = R.mergeRight(nullStrategy);

class Trail {
  hikers = [];
  isOpen = false;

  constructor(id, name, hike, plan, strategy = {}) {
    this.id = id;
    this.name = name;
    this.hike = hike;
    this.plan = plan;
    this.compass = plan.createCompass(hike.size);
    this.strategy = withDefaults(strategy);
    this.strategy.trail = this;
  }

  addHiker(hiker) {
    this.hikers.push(hiker);
  }

  open() {
    debug('open', this.name);
    this.assertOpen(false);
    this.strategy.onOpen();
    this.isOpen = true;
  }

  close() {
    debug('close', this.name);
    this.assertOpen();
    this.strategy.onClose();
    this.isOpen = false;
  }

  createTrailState() {
    return this.strategy.onCreateTrailState();
  }

  initializeTrailState() {
    this.assertOpen();
    this.strategy.onInitializeTrailState();
  }

  updateTrailState() {
    this.assertOpen();
    this.strategy.onUpdateTrailState();
  }

  assertOpen(expected = true) {
    if (this.isOpen !== expected) {
      throw new Error(`trail ${expected ? 'not' : 'already'} open`);
    }
  }
}

export default Trail;
