import Size from '../../../basic/size';
// import TrailState from '../../trails/trailState';

// import getDebugLog from '../debugLog';
// const debug = getDebugLog('trailMovementBehavior');

export const DisplacementScheme = {
  fixed: 'fixed',
  grid: 'grid',
  size: 'size',
  bounds: 'bounds',
};

class TrailMovementStrategy {
  initialLocation;
  trailState;
  steps;
  stepLimit;

  constructor(movementBehavior) {
    this.movementBehavior = movementBehavior;

    this.hasInitialLocation = false;
    this.displacementScheme = DisplacementScheme.fixed;
    this.fixedDisplacement = new Size(0, 0);
  }

  onStart() {}

  onMove() {}

  onEnd() {}

  setInitialLocation(location) {
    this.initialLocation = location;
    this.hasInitialLocation = true;
  }
}

export default TrailMovementStrategy;
