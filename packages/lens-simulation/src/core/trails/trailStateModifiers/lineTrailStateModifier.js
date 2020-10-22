import invariant from 'tiny-invariant';

import { HikerExitReason } from '../../constants';

import getDebugLog from '../debugLog';
const debug = getDebugLog('lineTrailStateModifier');

class LineTrailStateModifier {
  constructor(options = {}) {
    this.orientation = options.orientation;
  }

  modifyInitialTrailState(trailState) {
    invariant(trailState.trail, 'trail should be assigned to trail state');
    debug('modifyInitialTrailState', trailState.trail.name);
    if (this.orientation) {
      trailState.orientation = this.orientation;
    }
  }

  modifyUpdateTrailState(trailState) {
    const { trail, hiker } = trailState;
    invariant(trail, 'trail should be assigned to trail state');
    invariant(hiker, 'hiker should be assigned to trail state');

    debug('modifyUpdateTrailState', trail.name);
    trailState.addMovement();

    if (!trailState.isInBounds()) {
      hiker.abort(HikerExitReason.exceededImageBounds);
    }
  }
}

export default LineTrailStateModifier;
