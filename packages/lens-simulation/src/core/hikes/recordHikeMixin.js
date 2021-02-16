import getDebugLog from './debugLog';
import { buildType } from '../utils';

const debug = getDebugLog('RecordHikeMixin');

const RecordHikeMixin = superclass =>
  class extends superclass {
    getType() {
      return buildType(super.getType(), 'Record');
    }

    record(op) {
      debug(`record '${op}'`);
    }
  };

export default RecordHikeMixin;
