import invariant from 'tiny-invariant';
import * as R from 'ramda';
import TrailState from './trailState';

import getDebugLog from './debugLog';
const debug = getDebugLog('trail');

class NullTrailStrategy {
  onOpen() {}

  onClose() {}

  onCreateTrailState() {
    debug('NullTrailStrategy onCreateTrailState', this.trail.name);
    return new TrailState();
  }

  onInitializeTrailState(trailState) {
    invariant(this.trail, 'trail should be assigned to trail strategy');
    debug('NullTrailStrategy onInitializeTrailState', this.trail.name);
    this.trail.applyInitModifiers(trailState);
  }

  onUpdateTrailState(trailState) {
    invariant(this.trail, 'trail should be assigned to trail strategy');
    debug('NullTrailStrategy onUpdateTrailState', this.trail.name);
    this.trail.applyUpdateModifiers(trailState);
  }
}

export const mixTrailStrategy = (...args) => R.compose(...args)(NullTrailStrategy);

class Trail {
  hikers = [];
  modifiers = [];
  isOpen = false;

  constructor(id, name, hike, plan, strategy) {
    this.id = id;
    this.name = name;
    this.hike = hike;
    this.plan = plan;
    this.compass = plan.createCompass(hike.size);
    this.strategy = strategy || new NullTrailStrategy();
    this.strategy.trail = this;
  }

  addHiker(hiker) {
    debug('addHiker', this.name);
    this.hikers.push(hiker);
  }

  addModifier(modifier) {
    debug('addModifier', this.name);
    this.modifiers.push(modifier);
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
    debug('createTrailState', this.name);
    const trailState = this.strategy.onCreateTrailState();
    trailState.trail = this;
    return trailState;
  }

  initializeTrailState(trailState) {
    debug('initializeTrailState', this.name);
    this.assertOpen();
    this.strategy.onInitializeTrailState(trailState);
    trailState.resetLocation();
  }

  applyInitModifiers(trailState) {
    debug('applyInitModifiers', { trailState: trailState.toString() });
    this.modifiers.forEach(m => m.modifyInitialTrailState(trailState));
  }

  updateTrailState(trailState) {
    debug('updateTrailState', this.name);
    this.assertOpen();
    this.strategy.onUpdateTrailState(trailState);
  }

  applyUpdateModifiers(trailState) {
    debug('applyUpdateModifiers', { trailState: trailState.toString() });
    this.modifiers.forEach(m => m.modifyUpdateTrailState(trailState));
  }

  assertOpen(expected = true) {
    if (this.isOpen !== expected) {
      throw new Error(`trail ${expected ? 'not' : 'already'} open`);
    }
  }
}

export default Trail;
