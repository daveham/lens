import TrailState from './trailState';

import getDebugLog from './debugLog';
const debug = getDebugLog('trail');

class Trail {
  hike = null;
  plan = null;
  hikers = [];
  isOpen = false;

  constructor(hike, plan) {
    this.hike = hike;
    this.plan = plan;
  }

  addHiker(hiker) {
    this.hikers.push(hiker);
  }

  open() {
    this.assertOpen(false);
    this.onOpen();
    this.isOpen = true;
  }

  close() {
    this.assertOpen(true);
    this.onClose();
    this.isOpen = false;
  }

  createTrailState() {
    return this.onCreateTrailState();
  }

  initializeTrailState() {
    this.assertOpen(true);
    this.onInitializeTrailState();
  }

  updateTrailState() {
    this.assertOpen(true);
    this.onUpdateTrailState();
  }

  onOpen() {
    debug('onOpen');
  }

  onClose() {
    debug('onClose');
  }

  onCreateTrailState() {
    debug('onCreateTrailState');
    return new TrailState();
  }

  onInitializeTrailState() {
    debug('onInitializeTrailState');
  }

  onUpdateTrailState() {
    debug('onUpdateTrailState');
  }

  assertOpen(expected) {
    if (this.isOpen !== expected) {
      throw new Error(`trail ${expected ? 'not' : 'already'} open`);
    }
  }
}

export default Trail;
