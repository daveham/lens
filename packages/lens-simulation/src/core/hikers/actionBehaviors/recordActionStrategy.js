import getDebugLog from '../debugLog';
import { buildType } from '../../utils';

const debug = getDebugLog('recordActionStrategy');

const RecordActionStrategyMixin = superclass =>
  class extends superclass {
    getType() {
      return buildType(super.getType(), 'Record');
    }

    onAct() {
      super.onAct();
      debug('onAct');
      super.trace('RecordActionStrategyMixin.onAct');
      const ts = this.behavior.hikerStrategy.hiker.trailState;
      this.record({ ...ts.location });
    }

    record(op) {
      debug('record', op);
    }
  };

export default RecordActionStrategyMixin;
