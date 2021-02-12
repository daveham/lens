import * as R from 'ramda';
import E3 from 'eventemitter3';
import invariant from 'tiny-invariant';

import TrailState from './trailState';
import getDebugLog from './debugLog';
import { makeSuspendListKey } from '../factories/utils';

const debug = getDebugLog('trail');

export class BaseTrailStrategy {
  trail;

  constructor(options = {}) {
    debug('BaseTrailStrategy ctor', { options });
    this.options = { ...options };
  }

  getType() {
    return 'Trail';
  }

  assertIsValid() {
    invariant(this.trail, 'trail should be assigned to trail strategy');
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

    this.trail.applyInitModifiers(trailState);
  }

  onUpdateTrailState(trailState) {
    debug('onUpdateTrailState');
    this.assertIsValid();

    this.trail.applyUpdateModifiers(trailState);
  }
}

export function mixTrailStrategy(...args) {
  return R.compose(...args)(BaseTrailStrategy);
}

class Trail {
  events;
  hike;
  hikers = [];
  modifiers = [];
  isOpen = false;

  constructor(id, name, strategy) {
    debug('ctor', { id, name, strategy });
    this.events = new E3.EventEmitter();
    this.id = id;
    this.name = name;
    this.strategy = strategy || new BaseTrailStrategy();
    this.strategy.trail = this;
  }

  get type() {
    return this.strategy.getType();
  }

  addHiker(hiker) {
    this.hikers.push(hiker);
  }

  addModifier(modifier) {
    this.modifiers.push(modifier);
  }

  assertIsValid() {
    invariant(this.id, 'trail should have an id');
    invariant(this.strategy, 'trail should have a strategy');
    this.strategy.assertIsValid();
  }

  suspend(objectFactory) {
    this.assertIsValid();
    objectFactory.suspendItem(
      this,
      this.strategy.onSuspend(objectFactory, {
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
    this.strategy.onRestore(objectFactory, stateMap, state);

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
    this.strategy.onOpen();
    this.isOpen = true;
  }

  close() {
    debug('close');
    this.assertOpen();
    this.strategy.onClose();
    this.isOpen = false;
  }

  sendTrailStateCreatedEvent(trailState) {
    this.events.emit('trailStateCreated', { trailState });
  }

  createTrailState() {
    debug('createTrailState');
    const trailState = this.strategy.onCreateTrailState();
    trailState.trail = this;
    this.sendTrailStateCreatedEvent(trailState);
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
