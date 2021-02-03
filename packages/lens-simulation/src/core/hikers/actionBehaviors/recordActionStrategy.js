import getDebugLog from '../debugLog';
import { buildType } from '../../utils';

const debug = getDebugLog('recordActionStrategy');

const RecordActionStrategyMixin = superclass =>
  class extends superclass {
    getType() {
      return buildType(super.getType(), 'Record');
    }

    onInfer() {
      debug('onInfer');
      super.trace('RecordActionStrategyMixin.onInfer');
      super.onInfer();
    }
  };

export default RecordActionStrategyMixin;
