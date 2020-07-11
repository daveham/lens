import invariant from 'tiny-invariant';

import { HikerExitReason } from '../../constants';

import getDebugLog from '../debugLog';
const debug = getDebugLog('columnsFirstTrailStateModifier');

class ColumnsFirstTrailStateModifier {
  constructor(options = {}) {
    this.bottomToTop = options.bottomToTop;
    this.positionByCenter = options.positionByCenter;
  }

  modifyInitialTrailState(trailState) {
    invariant(trailState.trail, 'trail should be assigned to trail state');
    debug('modifyInitialTrailState', trailState.trail.name);

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
    const { trail, hiker, movement } = trailState;
    invariant(trail, 'trail should be assigned to trail state');
    invariant(hiker, 'hiker should be assigned to trail state');
    debug('modifyUpdateTrailState', trail.name);

    let nextLocation = this.bottomToTop
      ? [trailState.location.x, trailState.location.y - movement.height]
      : [trailState.location.x, trailState.location.y + movement.height];

    const isInBounds = trailState.isInBounds(nextLocation);

    if (!isInBounds) {
      nextLocation = [nextLocation[0] + movement.width, trailState.initialLocation.y];
    }

    trailState.location = nextLocation;

    if (!isInBounds && !trailState.isInBounds(trailState.location)) {
      hiker.abort(HikerExitReason.exceededImageBounds);
    }
  }
}

export default ColumnsFirstTrailStateModifier;
