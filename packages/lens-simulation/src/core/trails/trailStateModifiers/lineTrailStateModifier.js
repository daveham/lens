import invariant from 'tiny-invariant';

import { HikerExitReason } from '../../constants';

import getDebugLog from '../debugLog';
const debug = getDebugLog('lineTrailStateModifier');

class LineTrailStateModifier {
  constructor(id, name, options = {}) {
    debug('ctor', { id, name, options });
    this.id = id;
    this.name = name;
    this.orientation = options.orientation;
  }

  getType() {
    return 'Line';
  }

  assertIsValid(trailState) {
    invariant(trailState, 'trailState should be defined');
    invariant(trailState.hiker, 'hiker should be assigned to trail state');
    invariant(trailState.trail, 'trail should be assigned to trail state');
  }

  restore(stateMap) {
    debug('restore', { stateMap, id: this.id, state: stateMap.get(this.id) });
    const state = stateMap.get(this.id);
    this.name = state.name;
    this.orientation = state.orientation;
  }

  suspend(objectFactory) {
    debug('suspend');
    objectFactory.suspendItem(this, {
      type: this.getType(),
      name: this.name,
      orientation: this.orientation,
    });
  }

  modifyInitialTrailState(trailState) {
    debug('modifyInitialTrailState');
    this.assertIsValid(trailState);

    if (this.orientation) {
      trailState.orientation = this.orientation;
    }
  }

  modifyUpdateTrailState(trailState) {
    debug('modifyUpdateTrailState');
    this.assertIsValid(trailState);

    trailState.addMovement();

    if (!trailState.isInBounds()) {
      trailState.hiker.abort(HikerExitReason.exceededImageBounds);
    }
  }
}

export default LineTrailStateModifier;
