import Hike from 'hikes/hike';
import Trail from 'trails/trail';
import Hiker from 'hikers/hiker';

import getDebugLog from './debugLog';
const debug = getDebugLog('simulationFactory');

let idCounter = 0;
function getNextId() {
  idCounter += 1;
  return idCounter;
}

class SimulationFactory {
  initialize(plan, model, inventory) {
    this.plan = plan;
    this.model = model;
    this.inventory = inventory;
  }

  createHike() {
    const id = getNextId();
    const name = `hike-${id}`;
    return new Hike(id, name, this.model.size);
  }

  createTrail(hike) {
    const id = getNextId();
    const name = `trail-${id}`;
    const trail = new Trail(id, name, hike, this.plan);
    hike.addTrail(trail);
    return trail;
  }

  createHiker(trail) {
    const id = getNextId();
    const name = `hiker-${id}`;
    const hiker = new Hiker(id, name, trail);
    trail.addHiker(hiker);
    return hiker;
  }
}

export default SimulationFactory;
