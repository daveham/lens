import * as R from 'ramda';
import invariant from 'tiny-invariant';
import { HikerExitReason } from '../../constants';

import getDebugLog from '../debugLog';

const debug = getDebugLog('movementBehavior');

class MovementBehavior {
  started = false;
  hiker;

  constructor(id, name, options) {
    this.id = id;
    this.name = name;
    this.options = { ...options };
  }

  getType() {
    return 'MovementBehavior';
  }

  get type() {
    return this.getType();
  }

  assertIsValid() {
    invariant(this.id, 'movement behavior should have an id');
    invariant(this.hiker, 'movement behavior should have a hiker');
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

  onStart() {
    this.assertIsValid();
  }

  onMove() {
    debug('onMove');
    this.assertIsValid();

    this.abort(HikerExitReason.reachedStepLimit);
  }

  onEnd() {
    this.assertIsValid();
  }

  suspend(objectFactory) {
    this.assertIsValid();
    objectFactory.suspendItem(
      this,
      this.onSuspend(objectFactory, {
        type: this.type,
        id: this.id,
        name: this.name,
        started: this.started,
      }),
    );
  }

  restore(objectFactory, stateMap, state) {
    this.id = state.id;
    this.name = state.name;
    this.started = state.started;
    this.onRestore(objectFactory, stateMap, state);
    this.assertIsValid();
  }

  assertStarted(expected = true) {
    if (this.started !== expected) {
      throw new Error(`movement behavior ${expected ? 'not' : 'already'} started`);
    }
  }

  start() {
    debug('start');
    this.assertStarted(false);
    this.onStart();
    this.started = true;
  }

  move() {
    debug('move');
    this.assertStarted();
    return this.onMove();
  }

  end() {
    debug('end');
    this.assertStarted();
    this.onEnd();
  }

  abort(reason) {
    debug('abort', { name: this.hiker.name, reason });
    this.hiker.abort(reason);
  }
}

export default MovementBehavior;

export function mixMovementBehavior(...args) {
  return R.compose(...args)(MovementBehavior);
}
