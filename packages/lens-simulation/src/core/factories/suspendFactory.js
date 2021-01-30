import { makeSuspendListKey } from './utils';

import getDebugLog from './debugLog';
const debug = getDebugLog('suspendFactory');

class SuspendFactory {
  stateMap;

  constructor() {
    this.stateMap = new Map();
  }

  suspendItem(owner, data) {
    this.stateMap.set(owner.id, data);
  }

  suspendList(identifier, owner, list) {
    const ids = list.map(i => i.id);
    this.stateMap.set(makeSuspendListKey(identifier, owner.id), ids);
    list.forEach(i => i.suspend(this));
  }

  suspendSimulation(simulation) {
    debug('suspendSimulation', { simulation });
    simulation.suspend(this);
  }
}

export default SuspendFactory;
