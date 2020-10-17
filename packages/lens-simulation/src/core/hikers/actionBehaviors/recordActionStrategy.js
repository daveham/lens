import getDebugLog from '../debugLog';
const debug = getDebugLog('recordActionStrategy');

const RecordActionStrategyMixin = superclass =>
  class extends superclass {
    onInfer() {
      debug('onInfer');
      super.trace('RecordActionStrategyMixin.onInfer');
      return super.onInfer();
    }
  };

export default RecordActionStrategyMixin;
