import getDebugLog from './debugLog';

const debug = getDebugLog('controller');

class Controller {
  collect(simulation) {
    return simulation.collect();
  }

  run(simulation, data) {
    simulation.run(data);
  }

  isActive(simulation) {
    debug('isActive', { simulation });
    return simulation.isActive();
  }

  isReady(simulation) {
    debug('isReady', simulation);
    // return true if simulation is blocked
    // return true if simulation is finished
  }

  finish(simulation) {
    debug('finish', { simulation });
  }
}

export default Controller;
