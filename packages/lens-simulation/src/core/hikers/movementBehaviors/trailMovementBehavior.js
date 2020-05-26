import { vec2 } from 'gl-matrix';

import MovementBehavior from './movementBehavior';
// import TrailState from '../../trails/trailState';

// import getDebugLog from '../debugLog';
// const debug = getDebugLog('trailMovementBehavior');

export const DisplacementScheme = {
  fixed: 'fixed',
  grid: 'grid',
  size: 'size',
  bounds: 'bounds',
};

class TrailMovementBehavior extends MovementBehavior {
  initialLocation;
  hasInitialLocation;
  displacementScheme;
  fixedDisplacement;
  trailState;
  steps;
  stepLimit;

  constructor(hiker) {
    super(hiker);

    this.hasInitialLocation = false;
    this.displacementScheme = DisplacementScheme.fixed;
    this.fixedDisplacement = vec2(0, 0);
  }

  setInitialLocation(location) {
    this.initialLocation = location;
    this.hasInitialLocation = true;
  }
}

export default TrailMovementBehavior;
