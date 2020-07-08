import invariant from 'tiny-invariant';

import { HikerExitReason } from '../../constants';

import getDebugLog from '../debugLog';
const debug = getDebugLog('rowsFirstTrailStateModifier');

class RowsFirstTrailStateModifier {
  constructor(options = {}) {
    this.rightToLeft = options.rightToLeft;
    this.positionByCenter = options.positionByCenter;
  }

  modifyInitialTrailState(trailState) {
    invariant(trailState.trail, 'trail should be assigned to trail state');
    debug('modifyInitialTrailState', trailState.trail.name);

    const { bounds } = trailState.trail.hike;
    if (this.positionByCenter) {
      const movementHalf = trailState.movement.half();
      trailState.initialLocation = this.rightToLeft
        ? [bounds.width - movementHalf.width, movementHalf.height]
        : [movementHalf.width, movementHalf.height];
    } else {
      trailState.initialLocation = this.rightToLeft ? [bounds.width / 2, 0] : [0, 0];
    }
  }

  modifyUpdateTrailState(trailState) {
    const { trail, hiker, movement } = trailState;
    invariant(trail, 'trail should be assigned to trail state');
    invariant(hiker, 'hiker should be assigned to trail state');
    debug('modifyUpdateTrailState', trail.name);

    let nextLocation = this.rightToLeft
      ? [trailState.location.x - movement.width, trailState.location.y]
      : [trailState.location.x + movement.width, trailState.location.y];

    const isInBounds = trailState.isInBounds(nextLocation);

    if (!isInBounds) {
      nextLocation = [trailState.initialLocation.x, nextLocation[1] + movement.height];
    }

    trailState.location = nextLocation;

    if (!isInBounds && !trailState.isInBounds(trailState.location)) {
      hiker.abort(HikerExitReason.exceededImageBounds);
    }
  }
}

export default RowsFirstTrailStateModifier;
