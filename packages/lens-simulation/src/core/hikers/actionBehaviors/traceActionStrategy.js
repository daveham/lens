import getDebugLog from '../debugLog';
import { buildType } from '../../utils';

const debug = getDebugLog('traceActionStrategy');

const TraceActionStrategyMixin = superclass =>
  class extends superclass {
    getType() {
      return buildType(super.getType(), 'Trace');
    }

    trace(/* data */) {
      const { trailState } = this.behavior.hikerStrategy.hiker;
      if (trailState) {
        const {
          location: { x, y },
        } = trailState;
        debug(`trace '${this.label}' ${x},${y}`);
      }
    }
  };

export default TraceActionStrategyMixin;
