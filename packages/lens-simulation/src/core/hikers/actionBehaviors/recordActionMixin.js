import getDebugLog from '../debugLog';
import { buildType } from '../../utils';

const debug = getDebugLog('RecordActionMixin');

const RecordActionMixin = superclass => {
  return class extends superclass {
    getType() {
      return buildType(super.getType(), 'Record');
    }

    record(op) {
      debug(`record '${op}'`);
      debug('record hike type', this.hiker.trail.hike.type);
      this.hiker.trail.hike.record(op);
    }
  };
};

export default RecordActionMixin;
