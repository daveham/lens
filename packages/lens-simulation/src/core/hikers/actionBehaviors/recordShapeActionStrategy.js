import Rectangle from '../../../basic/rectangle';
import Size from '../../../basic/size';
import getDebugLog from '../debugLog';
import { RenderOp, RenderOpShapes } from '../../render/renderOp';
import { buildType } from '../../utils';

const debug = getDebugLog('recordShapeActionStrategy');

export const ShapeSizeScheme = {
  fixed: 'fixed',
  grid: 'grid',
  shape: 'shape',
};

const RecordShapeActionStrategyMixin = superclass =>
  class extends superclass {
    size;
    sizeScheme;
    borderSize;
    fixedSize;
    shapeBounds;

    constructor({ fixedSize, sizeScheme, borderSize, ...options } = {}) {
      debug('ctor');
      super(options);

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
          this.size = new Size(this.behavior.hikerStrategy.hiker.trail.plan.grain);
          break;
        // case ShapeSizeScheme.shape:
        //   break;
      }
    }

    onObserve() {
      super.onObserve();
      debug('onObserve');
      const { hiker } = this.behavior.hikerStrategy;
      hiker.renderBounds = new Rectangle(hiker.bounds);
    }

    onAct() {
      super.onAct();
      debug('onAct');
      const { hiker } = this.behavior.hikerStrategy;
      this.record(new RenderOp({ shape: RenderOpShapes.rectangle, bounds: hiker.renderBounds }));
    }
  };

export default RecordShapeActionStrategyMixin;
