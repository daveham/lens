import { buildType } from '../utils';

import getDebugLog from './debugLog';
const debug = getDebugLog('coverTrailStrategy');

export const CoverTrailMoveOrder = {
  rowsFirst: 'rowsFirst',
  rowsFirstRightToLeft: 'rowsFirstRightToLeft',
  columnsFirst: 'columnsFirst',
  columnsFirstBottomToTop: 'columnsFirstBottomToTop',
};

const CoverTrailStrategyMixin = superclass =>
  class extends superclass {
    getType() {
      return buildType(super.getType(), 'Cover');
    }

    onSuspend(objectFactory, state) {
      debug('onSuspend');
      return {
        ...super.onSuspend(objectFactory, state),
      };
    }
  };

export default CoverTrailStrategyMixin;
