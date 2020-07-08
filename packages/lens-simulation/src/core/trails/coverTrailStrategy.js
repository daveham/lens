import invariant from 'tiny-invariant';
import ColumnsFirstTrailStateModifier from './trailStateModifiers/columnsFirstTrailStateModifier';
import RowsFirstTrailStateModifier from './trailStateModifiers/rowsFirstTrailStateModifier';

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
    moveOrder;

    constructor(options = {}) {
      super(options);
      this.moveOrder = options.moveOrder || CoverTrailMoveOrder.rowsFirst;
    }

    onOpen() {
      invariant(this.trail, 'trail should be assigned to trail strategy');
      debug('onOpen', this.trail.name, this.moveOrder);
      switch (this.moveOrder) {
        case CoverTrailMoveOrder.rowsFirstRightToLeft:
          this.trail.addModifier(new RowsFirstTrailStateModifier(true));
          break;
        case CoverTrailMoveOrder.columnsFirst:
          this.trail.addModifier(new ColumnsFirstTrailStateModifier());
          break;
        case CoverTrailMoveOrder.columnsFirstBottomToTop:
          this.trail.addModifier(new ColumnsFirstTrailStateModifier(true));
          break;
        default:
          this.trail.addModifier(new RowsFirstTrailStateModifier());
      }
    }
  };

export default CoverTrailStrategyMixin;
