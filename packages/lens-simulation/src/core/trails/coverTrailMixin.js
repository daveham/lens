import { buildType } from '../utils';

// import getDebugLog from './debugLog';
// const debug = getDebugLog('CoverTrailMoveOrder');

export const CoverTrailMoveOrder = {
  rowsFirst: 'rowsFirst',
  rowsFirstRightToLeft: 'rowsFirstRightToLeft',
  columnsFirst: 'columnsFirst',
  columnsFirstBottomToTop: 'columnsFirstBottomToTop',
};

const CoverTrailMixin = superclass =>
  class extends superclass {
    getType() {
      return buildType(super.getType(), 'Cover');
    }

    onSuspend(objectFactory, state) {
      return {
        ...super.onSuspend(objectFactory, state),
      };
    }
  };

export default CoverTrailMixin;
