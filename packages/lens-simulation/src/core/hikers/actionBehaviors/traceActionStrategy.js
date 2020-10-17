import getDebugLog from '../debugLog';
const debug = getDebugLog('traceActionStrategy');

const TraceActionStrategyMixin = superclass =>
  class extends superclass {
    trace(data) {
      debug('trace', { data });
    }

    // onInfer() {
    //   debug('onInfer');
    //   return super.onInfer();
    // }
  };

export default TraceActionStrategyMixin;
