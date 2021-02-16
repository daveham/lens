import * as R from 'ramda';
import E3 from 'eventemitter3';
import invariant from 'tiny-invariant';

import TrailState from './trailState';
import getDebugLog from './debugLog';
import { makeSuspendListKey } from '../factories/utils';

const debug = getDebugLog('trail');

class Trail {
  events;
  hike;
  hikers = [];
  modifiers = [];
  isOpen = false;

  constructor(id, name, options = {}) {
    this.events = new E3.EventEmitter();
    this.id = id;
    this.name = name;
    this.options = { ...options };
  }

  get type() {
    return this.getType();
  }

  getType() {
    return 'Trail';
  }

  addHiker(hiker) {
    this.hikers.push(hiker);
  }

  addModifier(modifier) {
    this.modifiers.push(modifier);
  }

  assertIsValid() {
    invariant(this.id, 'trail should have an id');
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

  onCreateTrailState() {
    debug('onCreateTrailState');
    this.assertIsValid();

    return new TrailState();
  }

  onInitializeTrailState(trailState) {
    debug('onInitializeTrailState');
    this.assertIsValid();

    this.applyInitModifiers(trailState);
  }

  onUpdateTrailState(trailState) {
    debug('onUpdateTrailState');
    this.assertIsValid();

    this.applyUpdateModifiers(trailState);
  }

  suspend(objectFactory) {
    this.assertIsValid();
    objectFactory.suspendItem(
      this,
      this.onSuspend(objectFactory, {
        type: this.type,
        id: this.id,
        name: this.name,
      }),
    );
    objectFactory.suspendList('K', this, this.hikers);
    objectFactory.suspendList('TM', this, this.modifiers);
  }

  restore(objectFactory, stateMap, state) {
    this.id = state.id;
    this.name = state.name;
    this.onRestore(objectFactory, stateMap, state);

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
    this.assertIsValid();
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

  isActive() {
    return this.hikers.some(k => k.isActive());
  }

  open() {
    debug('open');
    this.assertOpen(false);
    this.onOpen();
    this.isOpen = true;
  }

  close() {
    debug('close');
    this.assertOpen();
    this.onClose();
    this.isOpen = false;
  }

  sendTrailStateCreatedEvent(trailState) {
    this.events.emit('trailStateCreated', { trailState });
  }

  createTrailState() {
    debug('createTrailState');
    const trailState = this.onCreateTrailState();
    trailState.trail = this;
    this.sendTrailStateCreatedEvent(trailState);
    return trailState;
  }

  initializeTrailState(trailState) {
    debug('initializeTrailState');
    this.assertOpen();
    this.onInitializeTrailState(trailState);
    trailState.resetLocation();
  }

  applyInitModifiers(trailState) {
    debug('applyInitModifiers');
    this.modifiers.forEach(m => m.modifyInitialTrailState(trailState));
  }

  updateTrailState(trailState) {
    debug('updateTrailState');
    this.assertOpen();
    this.onUpdateTrailState(trailState);
  }

  applyUpdateModifiers(trailState) {
    debug('applyUpdateModifiers');
    this.modifiers.forEach(m => m.modifyUpdateTrailState(trailState));
  }
}

export default Trail;

export function mixTrail(...args) {
  return R.compose(...args)(Trail);
}
