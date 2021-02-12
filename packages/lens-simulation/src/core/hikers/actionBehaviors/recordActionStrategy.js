import getDebugLog from '../debugLog';
import { buildType } from '../../utils';

const debug = getDebugLog('recordActionStrategy');

const RecordActionStrategyMixin = superclass => {
  debug('RecordActionStrategyMixin', { superclass });
  return class extends superclass {
    constructor({ abc, ...other } = {}) {
      super(other);
    }

    getType() {
      return buildType(super.getType(), 'Record');
    }

    record(op) {
      debug(`record '${op}'`);
      // TODO
    }
  };
};

export default RecordActionStrategyMixin;
