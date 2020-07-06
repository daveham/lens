import invariant from 'tiny-invariant';
import LineTrailStateModifier from './trailStateModifiers/lineTrailStateModifier';

import getDebugLog from './debugLog';
const debug = getDebugLog('lineTrailStrategy');

const LineTrailStrategyMixin = superclass =>
  class extends superclass {
    onOpen() {
      invariant(this.trail, 'trail should be assigned to trail strategy');
      debug('onOpen', this.trail.name);
      this.trail.addModifier(new LineTrailStateModifier());
    }
  };

export default LineTrailStrategyMixin;
