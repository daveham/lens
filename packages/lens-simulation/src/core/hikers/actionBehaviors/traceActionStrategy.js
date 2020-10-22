import getDebugLog from '../debugLog';
const debug = getDebugLog('traceActionStrategy');

const TraceActionStrategyMixin = superclass =>
  class extends superclass {
    trace(/* data */) {
      const { hikerStrategy } = this.behavior;
      const { movementBehavior } = hikerStrategy;
      if (movementBehavior.strategy.trailState) {
        const {
          location: { x, y },
        } = movementBehavior.strategy.trailState;
        debug(`trace '${this.label}' ${x},${y}`);
      }
    }
  };

export default TraceActionStrategyMixin;
