import getDebugLog from './debugLog';
const debug = getDebugLog('simulation');

class Simulation {
  hikes = [];

  constructor(options) {
    this.options = options;
  }

  addHike(hike) {
    debug('addHike');
    this.hikes.push(hike);
  }
}

export default Simulation;
