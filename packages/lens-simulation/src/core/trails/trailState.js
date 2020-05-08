import { vec2 } from 'gl-matrix';

import getDebugLog from './debugLog';
const debug = getDebugLog('trailState');

class TrailState {
  location = null;

  constructor() {
    this.location = vec2(0, 0);
    debug('constructed location', this.location);
  }
}

export default TrailState;
