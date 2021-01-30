import invariant from 'tiny-invariant';
import * as R from 'ramda';
import { makeSuspendListKey } from '../factories/utils';
import TrailState from './trailState';

import getDebugLog from './debugLog';
const debug = getDebugLog('trail');

export class NullTrailStrategy {
  trail;

  constructor(options = {}) {
    debug('NullTrailStrategy ctor', { options });
    this.options = { ...options };
  }

  getType() {
    return 'Trail';
  }

  assertIsValid() {
    invariant(this.trail, 'trail should be assigned to trail strategy');
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

  onCreateTrailState() {
    debug('onCreateTrailState');
    this.assertIsValid();

    return new TrailState();
  }

  onInitializeTrailState(trailState) {
    debug('onInitializeTrailState');
    this.assertIsValid();

    this.trail.applyInitModifiers(trailState);
  }

  onUpdateTrailState(trailState) {
    debug('onUpdateTrailState');
    this.assertIsValid();

    this.trail.applyUpdateModifiers(trailState);
  }
}

export const mixTrailStrategy = (...args) => R.compose(...args)(NullTrailStrategy);

class Trail {
  hike;
  hikers = [];
  modifiers = [];
  isOpen = false;

  constructor(id, name, strategy) {
    debug('ctor', { id, name, strategy });
    this.id = id;
    this.name = name;
    this.strategy = strategy || new NullTrailStrategy();
    this.strategy.trail = this;
  }

  addHiker(hiker) {
    debug('addHiker');
    this.hikers.push(hiker);
  }

  addModifier(modifier) {
    debug('addModifier');
    this.modifiers.push(modifier);
  }

  assertOpen(expected = true) {
    if (this.isOpen !== expected) {
      throw new Error(`trail ${expected ? 'not' : 'already'} open`);
    }
  }

  configure(plan) {
    this.plan = plan;
    this.compass = plan.createCompass(this.hike.size);
  }

  restore(objectFactory, stateMap, state) {
    debug('restore');
    const myState = state || stateMap.get(this.id);
    this.id = myState.id;
    this.name = myState.name;
    this.strategy.onRestore(objectFactory, stateMap, myState);

    const modifierList = stateMap.get(makeSuspendListKey('TM', this.id));
    if (modifierList) {
      modifierList.forEach(modifierId =>
        this.addModifier(objectFactory.restoreTrailModifier(this, modifierId, stateMap)),
      );
    }

    const hikerList = stateMap.get(makeSuspendListKey('K', this.id));
    if (hikerList) {
      hikerList.forEach(hikerId =>
        this.addHiker(objectFactory.restoreHiker(this, hikerId, stateMap)),
      );
    }
  }

  suspend(objectFactory) {
    debug('suspend');
    objectFactory.suspendItem(
      this,
      this.strategy.onSuspend(objectFactory, {
        type: this.strategy.getType(),
        id: this.id,
        name: this.name,
      }),
    );
    objectFactory.suspendList('K', this, this.hikers);
    objectFactory.suspendList('TM', this, this.modifiers);
  }

  isActive() {
    return this.hikers.some(k => k.isActive());
  }

  open() {
    debug('open');
    this.assertOpen(false);
    this.strategy.onOpen();
    this.isOpen = true;
  }

  close() {
    debug('close');
    this.assertOpen();
    this.strategy.onClose();
    this.isOpen = false;
  }

  createTrailState() {
    debug('createTrailState');
    const trailState = this.strategy.onCreateTrailState();
    trailState.trail = this;
    return trailState;
  }

  initializeTrailState(trailState) {
    debug('initializeTrailState');
    this.assertOpen();
    this.strategy.onInitializeTrailState(trailState);
    trailState.resetLocation();
  }

  applyInitModifiers(trailState) {
    debug('applyInitModifiers');
    this.modifiers.forEach(m => m.modifyInitialTrailState(trailState));
  }

  updateTrailState(trailState) {
    debug('updateTrailState');
    this.assertOpen();
    this.strategy.onUpdateTrailState(trailState);
  }

  applyUpdateModifiers(trailState) {
    debug('applyUpdateModifiers');
    this.modifiers.forEach(m => m.modifyUpdateTrailState(trailState));
  }
}

export default Trail;
