import invariant from 'tiny-invariant';

import { HikerExitReason } from '../../constants';

import getDebugLog from '../debugLog';

const debug = getDebugLog('rowsFirstTrailStateModifier');

class RowsFirstTrailStateModifier {
  constructor(id, name, options = {}) {
    this.id = id;
    this.name = name;
    this.rightToLeft = options.rightToLeft;
    this.positionByCenter = options.positionByCenter;
  }

  getType() {
    return 'RowsFirst';
  }

  assertIsValid(trailState) {
    invariant(trailState, 'trailState should be defined');
    invariant(trailState.hiker, 'hiker should be assigned to trail state');
    invariant(trailState.trail, 'trail should be assigned to trail state');
    invariant(trailState.trail.hike, 'hike should be assigned to trail in trail state');
    invariant(trailState.trail.hike.bounds, 'bounds should be defined');
    invariant(trailState.initialLocation, 'initialLocation should be defined');
    invariant(trailState.movement, 'movement should be defined');
  }

  restore(stateMap) {
    debug('restore');
    const state = stateMap.get(this.id);
    this.name = state.name;
    this.rightToLeft = state.rightToLeft;
    this.positionByCenter = state.positionByCenter;
  }

  suspend(objectFactory) {
    debug('suspend');
    objectFactory.suspendItem(this, {
      type: this.getType(),
      name: this.name,
      rightToLeft: this.rightToLeft,
      positionByCenter: this.positionByCenter,
    });
  }

  modifyInitialTrailState(trailState) {
    debug('modifyInitialTrailState');
    this.assertIsValid(trailState);

    const { bounds } = trailState.trail.hike;
    if (this.positionByCenter) {
      const movementHalf = trailState.movement.half();
      trailState.initialLocation = this.rightToLeft
        ? [bounds.width - movementHalf.width, movementHalf.height]
        : movementHalf;
    } else {
      trailState.initialLocation = this.rightToLeft ? [bounds.width / 2, 0] : [0, 0];
    }
  }

  modifyUpdateTrailState(trailState) {
    debug('modifyUpdateTrailState');
    this.assertIsValid(trailState);

    const { initialLocation, location, movement } = trailState;

    let nextLocation = this.rightToLeft
      ? [location.x - movement.width, location.y]
      : [location.x + movement.width, location.y];

    const isInBounds = trailState.isInBounds(nextLocation);

    if (!isInBounds) {
      nextLocation = [initialLocation.x, nextLocation[1] + movement.height];
    }

    trailState.location = nextLocation;

    if (!isInBounds && !trailState.isInBounds(trailState.location)) {
      trailState.hiker.abort(HikerExitReason.exceededImageBounds);
    }
  }
}

export default RowsFirstTrailStateModifier;
