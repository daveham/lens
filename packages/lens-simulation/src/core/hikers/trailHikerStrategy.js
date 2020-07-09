import invariant from 'tiny-invariant';
import MovementBehavior, {
  mixMovementBehaviorStrategy,
} from './movementBehaviors/movementBehavior';
import TrailMovementStrategyMixin from './movementBehaviors/trailMovementStrategy';

import getDebugLog from './debugLog';
const debug = getDebugLog('trailHikerStrategy');

const TrailHikerStrategyMixin = superclass =>
  class extends superclass {
    constructor(options = {}) {
      super(options);
      this.options = options;
    }

    onCreateMovementBehavior() {
      invariant(this.hiker, 'hiker should be assigned to strategy');
      debug('onCreateMovementBehavior', this.hiker.name);

      const TrailMovementStrategy = mixMovementBehaviorStrategy(TrailMovementStrategyMixin);
      return new MovementBehavior(
        this.hiker,
        new TrailMovementStrategy(this.options.movementOptions),
      );
    }
  };

export default TrailHikerStrategyMixin;