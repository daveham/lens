import { buildType } from '../utils';

// import getDebugLog from './debugLog';
// const debug = getDebugLog('LineTrailMixin');

const LineTrailMixin = superclass =>
  class extends superclass {
    getType() {
      return buildType(super.getType(), 'Line');
    }

    onSuspend(objectFactory, state) {
      return {
        ...super.onSuspend(objectFactory, state),
      };
    }
  };

export default LineTrailMixin;
