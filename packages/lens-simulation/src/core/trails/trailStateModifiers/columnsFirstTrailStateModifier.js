import invariant from 'tiny-invariant';

import { HikerExitReason } from '../../constants';

import getDebugLog from '../debugLog';
const debug = getDebugLog('columnsFirstTrailStateModifier');

class ColumnsFirstTrailStateModifier {
  constructor(id, name, options = {}) {
    this.id = id;
    this.name = name;
    this.bottomToTop = options.bottomToTop;
    this.positionByCenter = options.positionByCenter;
  }

  getType() {
    return 'ColumnsFirst';
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
    this.bottomToTop = state.bottomToTop;
    this.positionByCenter = state.positionByCenter;
  }

  suspend(objectFactory) {
    debug('suspend');
    objectFactory.suspendItem(this, {
      type: this.getType(),
      name: this.name,
      bottomToTop: this.bottomToTop,
      positionByCenter: this.positionByCenter,
    });
  }

  modifyInitialTrailState(trailState) {
    debug('modifyInitialTrailState');
    this.assertIsValid(trailState);

    const { bounds } = trailState.trail.hike;
    if (this.positionByCenter) {
      const movementHalf = trailState.movement.half();
      trailState.initialLocation = this.bottomToTop
        ? [movementHalf.width, bounds.height - movementHalf.height]
        : movementHalf;
    } else {
      trailState.initialLocation = this.bottomToTop ? [0, bounds.height / 2] : [0, 0];
    }
  }

  modifyUpdateTrailState(trailState) {
    debug('modifyUpdateTrailState');
    this.assertIsValid(trailState);

    const { initialLocation, location, movement } = trailState;

    let nextLocation = this.bottomToTop
      ? [location.x, location.y - movement.height]
      : [location.x, location.y + movement.height];

    const isInBounds = trailState.isInBounds(nextLocation);

    if (!isInBounds) {
      nextLocation = [nextLocation[0] + movement.width, initialLocation.y];
    }

    trailState.location = nextLocation;

    if (!isInBounds && !trailState.isInBounds(trailState.location)) {
      trailState.hiker.abort(HikerExitReason.exceededImageBounds);
    }
  }
}

export default ColumnsFirstTrailStateModifier;
