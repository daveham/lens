import invariant from 'tiny-invariant';

import { HikerExitReason } from '../../constants';

import getDebugLog from '../debugLog';
const debug = getDebugLog('lineTrailStateModifier');

class LineTrailStateModifier {
  modifyInitialTrailState(trailState) {
    invariant(trailState.trail, 'trail should be assigned to trail state');
    debug('modifyInitialTrailState', trailState.trail.name);
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
