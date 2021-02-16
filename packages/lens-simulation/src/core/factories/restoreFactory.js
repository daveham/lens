import Simulation from '../simulation';
import {
  createActionBehaviorClass,
  createDataBehaviorClass,
  createHikeClass,
  createHikerClass,
  createMovementBehaviorClass,
  createTrailClass,
  createTrailModifierClass,
} from './classFactory';
import { getEndType } from './utils';

// const debug = getDebugLog('objectFactory');

class RestoreFactory {
  stateMap;

  constructor() {
    this.stateMap = new Map();
  }

  restoreSimulation(id, executionId, stateMap) {
    const state = stateMap.get(id);
    const simulation = new Simulation(id, executionId);
    simulation.restore(this, stateMap, state);

    return simulation;
  }

  restoreHike(simulation, id, stateMap) {
    const state = stateMap.get(id);
    const { name, options } = state;
    const type = getEndType(state);
    const hike = createHikeClass(id, name, type, options);
    hike.simulation = simulation;
    hike.restore(this, stateMap, state);
    return hike;
  }

  restoreTrailModifier(trail, id, stateMap) {
    const state = stateMap.get(id);
    const type = getEndType(state);
    const { options } = state;
    const modifier = createTrailModifierClass(type, id, state.name, options);
    modifier.trail = trail;
    return modifier;
  }

  restoreTrail(hike, id, stateMap) {
    const state = stateMap.get(id);
    const { name, options } = state;
    const type = getEndType(state);
    const trail = createTrailClass(id, name, type, options);
    trail.hike = hike;
    trail.restore(this, stateMap, state);
    return trail;
  }

  restoreMovementBehavior(id, stateMap) {
    const state = stateMap.get(id);
    const { name, options } = state;
    const type = getEndType(state);
    return createMovementBehaviorClass(id, name, type, options);
  }

  restoreActionBehavior(id, stateMap) {
    const state = stateMap.get(id);
    const { name, options } = state;
    const type = getEndType(state);
    return createActionBehaviorClass(id, name, type, options);
  }

  restoreDataBehavior(id, stateMap) {
    const state = stateMap.get(id);
    const { name, options } = state;
    const type = getEndType(state);
    return createDataBehaviorClass(id, name, type, options);
  }

  restoreTrailHikerBehaviors(
    hiker,
    stateMap,
    { movementBehaviorId, actionBehaviorId, dataBehaviorId },
  ) {
    if (movementBehaviorId) {
      const movementBehavior = this.restoreMovementBehavior(movementBehaviorId, stateMap);
      movementBehavior.hiker = hiker;
      movementBehavior.restore(this, stateMap, stateMap.get(movementBehaviorId));
      hiker.movementBehavior = movementBehavior;
    }

    if (actionBehaviorId) {
      const actionBehavior = this.restoreActionBehavior(actionBehaviorId, stateMap);
      actionBehavior.hiker = hiker;
      actionBehavior.restore(this, stateMap, stateMap.get(actionBehaviorId));
      hiker.actionBehavior = actionBehavior;
    }

    if (dataBehaviorId) {
      const dataBehavior = this.restoreDataBehavior(dataBehaviorId, stateMap);
      dataBehavior.hiker = hiker;
      dataBehavior.restore(this, stateMap, stateMap.get(dataBehaviorId));
      hiker.dataBehavior = dataBehavior;
    }
  }

  restoreHiker(trail, id, stateMap) {
    const state = stateMap.get(id);
    const { name, options } = state;
    const type = getEndType(state);
    const hiker = createHikerClass(id, name, type, options);
    hiker.trail = trail;
    hiker.restore(this, stateMap, state);
    return hiker;
  }
}

export default RestoreFactory;
