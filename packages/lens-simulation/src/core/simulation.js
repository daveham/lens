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

  run(index = -1) {
    debug('run', { index });
    if (index >= 0 && index < this.hikes.length) {
      const hike = this.hikes[index];
      return hike.run().catch(err => {
        debug('run exception', { err });
      });
    }
    return Promise.resolve();
  }
}

export default Simulation;
