import invariant from 'tiny-invariant';

import getDebugLog from './debugLog';
import { makeSuspendListKey } from './factories/utils';
const debug = getDebugLog('simulation');

class Simulation {
  hikes = [];
  step;

  constructor(id, executionId) {
    this.id = id;
    this.executionId = executionId;
    this.step = -1;
  }

  addHike(hike) {
    debug('addHike');
    this.hikes.push(hike);
  }

  assertIsValid() {
    invariant(this.id, 'id must be assigned for restore');
  }

  suspend(objectFactory) {
    this.assertIsValid();
    objectFactory.suspendItem(this, {
      id: this.id,
      executionId: this.executionId,
      step: this.step,
    });
    objectFactory.suspendList('H', this, this.hikes);
  }

  restore(objectFactory, stateMap, state) {
    this.executionId = state.executionId;
    this.step = state.step;

    const hikeList = stateMap.get(makeSuspendListKey('H', this.id));
    if (hikeList) {
      hikeList.forEach(hikeId => this.addHike(objectFactory.restoreHike(this, hikeId, stateMap)));
    }
    this.assertIsValid();
  }

  isActive() {
    return this.hikes.some(h => h.isActive());
  }

  collect() {
    debug('collect');
    return {};
  }

  run() {
    this.step = this.step + 1;
    debug('run', { step: this.step });
    this.hikes.forEach(h => {
      h.run(this.step);
    });
  }
}

export default Simulation;
