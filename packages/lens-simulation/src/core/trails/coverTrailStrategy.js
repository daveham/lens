// import getDebugLog from './debugLog';
// const debug = getDebugLog('coverTrailStrategy');

export const CoverTrailMoveOrder = {
  rowsFirst: 'rowsFirst',
  rowsFirstRightToLeft: 'rowsFirstRightToLeft',
  columnsFirst: 'columnsFirst',
  columnsFirstBottomToTop: 'columnsFirstBottomToTop',
};

const CoverTrailStrategyMixin = superclass => class extends superclass {};

export default CoverTrailStrategyMixin;
