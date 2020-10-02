// import getDebugLog from './debugLog';
// const debug = getDebugLog('trailHikerStrategy');

const TrailHikerStrategyMixin = superclass =>
  class extends superclass {
    // onCreateMovementBehavior() {
    //   invariant(this.hiker, 'hiker should be assigned to strategy');
    //   debug('onCreateMovementBehavior', this.hiker.name);
    //
    //   const TrailMovementStrategy = mixMovementBehaviorStrategy(TrailMovementStrategyMixin);
    //   return new MovementBehavior(
    //     this.hiker,
    //     new TrailMovementStrategy(this.options.movementOptions),
    //   );
    // }
  };

export default TrailHikerStrategyMixin;
