import { buildType } from '../utils';

import getDebugLog from './debugLog';
const debug = getDebugLog('lineTrailStrategy');

const LineTrailStrategyMixin = superclass =>
  class extends superclass {
    getType() {
      return buildType(super.getType(), 'Line');
    }

    onSuspend(objectFactory, state) {
      debug('onSuspend');
      return {
        ...super.onSuspend(objectFactory, state),
      };
    }
  };

export default LineTrailStrategyMixin;
