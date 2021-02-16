import Rectangle from '../../../basic/rectangle';
import Size from '../../../basic/size';
import getDebugLog from '../debugLog';
import { RenderOp, RenderOpShapes } from '../../render/renderOp';
import { buildType } from '../../utils';

const debug = getDebugLog('RecordShapeActionMixin');

export const ShapeSizeScheme = {
  fixed: 'fixed',
  grid: 'grid',
  shape: 'shape',
};

const RecordShapeActionMixin = superclass =>
  class extends superclass {
    size;
    sizeScheme;
    borderSize;
    fixedSize;
    shapeBounds;

    constructor(id, name, { fixedSize, sizeScheme, borderSize, ...options } = {}) {
      super(id, name, options);

      this.fixedSize = fixedSize || new Size(4, 4);
      this.sizeScheme = sizeScheme || ShapeSizeScheme.grid;
      this.borderSize = borderSize;
      this.size = new Size(this.fixedSize);
    }

    getType() {
      return buildType(super.getType(), 'RecordShape');
    }

    onSuspend(objectFactory, state) {
      return {
        ...super.onSuspend(objectFactory, state),
        size: this.size,
        sizeScheme: this.sizeScheme,
        borderSize: this.borderSize,
        fixedSize: this.fixedSize,
        shapeBounds: this.shapeBounds,
      };
    }

    onRestore(objectFactory, stateMap, state) {
      super.onRestore(objectFactory, stateMap, state);
      this.sizeScheme = state.sizeScheme;
      this.borderSize = state.borderSize;
      this.fixedSize = state.fixedSize;
      this.size = state.size;
      this.shapeBounds = state.shapeBounds;
    }

    onStart() {
      debug('onStart');
      super.onStart();
      switch (this.sizeScheme) {
        case ShapeSizeScheme.fixed:
          this.size = new Size(this.fixedSize);
          break;
        case ShapeSizeScheme.grid:
          this.size = new Size(this.hiker.trail.plan.grain);
          break;
        // case ShapeSizeScheme.shape:
        //   break;
      }
    }

    onObserve() {
      super.onObserve();
      debug('onObserve');
      this.hiker.renderBounds = new Rectangle(this.hiker.bounds);
    }

    onAct() {
      super.onAct();
      debug('onAct');
      this.record(
        new RenderOp({ shape: RenderOpShapes.rectangle, bounds: this.hiker.renderBounds }),
      );
    }
  };

export default RecordShapeActionMixin;
