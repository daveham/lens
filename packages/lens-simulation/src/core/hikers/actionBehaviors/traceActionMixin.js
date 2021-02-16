import getDebugLog from '../debugLog';
import { buildType } from '../../utils';

const debug = getDebugLog('TraceActionMixin');

const TraceActionMixin = superclass =>
  class extends superclass {
    getType() {
      return buildType(super.getType(), 'Trace');
    }

    trace(/* data */) {
      const { trailState } = this.hiker;
      if (trailState) {
        const {
          location: { x, y },
        } = trailState;
        debug(`trace '${this.label}' ${x},${y}`);
      }
    }
  };

export default TraceActionMixin;
