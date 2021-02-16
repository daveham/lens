import * as R from 'ramda';
import invariant from 'tiny-invariant';

import getDebugLog from '../debugLog';

const debug = getDebugLog('actionBehavior');

class ActionBehavior {
  started = false;
  hiker;
  options;

  constructor(id, name, options) {
    this.id = id;
    this.name = name;
    this.options = { ...options };
  }

  assertIsValid() {
    invariant(this.id, 'action behavior should have an id');
    invariant(this.hiker, 'action behavior should have a hiker');
  }

  getType() {
    return 'ActionBehavior';
  }

  get type() {
    return this.getType();
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

  trace() {}

  onStart() {
    debug('onStart');
  }

  onNeedsData() {
    debug('onNeedsData');
    return false;
  }

  areConstraintsSatisfied() {
    debug('areConstraintsSatisfied');
    return true;
  }

  onObserve() {
    debug('onObserve');
  }

  onInfer() {
    debug('onInfer');
  }

  onAct() {
    debug('onAct');
  }

  onEnd() {
    debug('onEnd');
  }

  assertIsStarted(expected = true) {
    invariant(this.started === expected, `action behavior ${expected ? 'not' : 'already'} started`);
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

  get label() {
    return this.hiker.name;
  }

  start() {
    debug('start', this.label);
    this.assertIsStarted(false);
    this.onStart();
    this.started = true;
  }

  needsData() {
    debug('needsData', this.label);
    this.assertIsStarted();
    return this.onNeedsData();
  }

  act() {
    this.assertIsValid();
    debug('act', this.label);
    this.assertIsStarted();

    this.onObserve();
    this.onInfer();
    if (this.areConstraintsSatisfied()) {
      this.onAct();
    }
  }

  end() {
    debug('end', this.label);
    this.assertIsStarted();
    this.onEnd();
  }

  abort(reason) {
    debug('abort', this.label);
    this.hiker.abort(reason);
  }
}

export default ActionBehavior;

export function mixActionBehavior(...args) {
  return R.compose(...args)(ActionBehavior);
}
