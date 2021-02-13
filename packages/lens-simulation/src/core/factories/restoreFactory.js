import ActionBehavior from '../hikers/actionBehaviors/actionBehavior';
import DataBehavior from '../hikers/dataBehaviors/dataBehavior';
import Hike from '../hikes/hike';
import Hiker from '../hikers/hiker';
import MovementBehavior from '../hikers/movementBehaviors/movementBehavior';
import Simulation from '../simulation';
import Trail from '../trails/trail';
import getDebugLog from './debugLog';
import {
  createActionBehaviorStrategyClass,
  createDataBehaviorStrategyClass,
  createHikeStrategyClass,
  createHikerStrategyClass,
  createMovementBehaviorStrategyClass,
  createTrailModifierClass,
  createTrailStrategyClass,
} from './classFactory';
import { extractTypeAndOptions, getEndType } from './utils';

const debug = getDebugLog('objectFactory');

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

  restoreHikeStrategy(id, stateMap, state) {
    const [, options] = extractTypeAndOptions(state);
    const type = getEndType(state);
    return createHikeStrategyClass(type, options);
  }

  restoreHike(simulation, id, stateMap) {
    const state = stateMap.get(id);
    const strategy = this.restoreHikeStrategy(id, stateMap, state);

    const hike = new Hike(id, state.name, strategy);
    hike.simulation = simulation;
    hike.restore(this, stateMap, state);

    return hike;
  }

  restoreTrailStrategy(id, stateMap, state) {
    const type = getEndType(state);
    const { options } = state;
    return createTrailStrategyClass(type, options);
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
    const strategy = this.restoreTrailStrategy(id, stateMap, state);

    const trail = new Trail(id, state.name, strategy);
    trail.hike = hike;
    trail.restore(this, stateMap, state);

    return trail;
  }

  restoreMovementBehaviorStrategy(id, stateMap, state) {
    const type = getEndType(state);
    const { options } = state;
    return createMovementBehaviorStrategyClass(type, options);
  }

  restoreMovementBehavior(id, stateMap) {
    debug('restoreMovementBehavior');
    const state = stateMap.get(id);
    const strategy = this.restoreMovementBehaviorStrategy(id, stateMap, state);

    return new MovementBehavior(id, state.name, strategy);
  }

  restoreActionBehaviorStrategy(id, stateMap, state) {
    const type = getEndType(state);
    const { options } = state;
    return createActionBehaviorStrategyClass(type, options);
  }

  restoreActionBehavior(id, stateMap) {
    debug('restoreActionBehavior');
    const state = stateMap.get(id);
    const strategy = this.restoreActionBehaviorStrategy(id, stateMap, state);

    return new ActionBehavior(id, state.name, strategy);
  }

  restoreDataBehaviorStrategy(id, stateMap, state) {
    const type = getEndType(state);
    const { options } = state;
    return createDataBehaviorStrategyClass(type, options);
  }

  restoreDataBehavior(id, stateMap) {
    debug('restoreDataBehavior');
    const state = stateMap.get(id);
    const strategy = this.restoreDataBehaviorStrategy(id, stateMap, state);

    return new DataBehavior(id, state.name, strategy);
  }

  restoreTrailHikerBehaviors(
    strategy,
    stateMap,
    { movementBehaviorId, actionBehaviorId, dataBehaviorId },
  ) {
    if (movementBehaviorId) {
      const movementBehavior = this.restoreMovementBehavior(movementBehaviorId, stateMap);
      movementBehavior.hikerStrategy = strategy;
      movementBehavior.restore(this, stateMap, stateMap.get(movementBehaviorId));
      strategy.movementBehavior = movementBehavior;
    }

    if (actionBehaviorId) {
      const actionBehavior = this.restoreActionBehavior(actionBehaviorId, stateMap);
      actionBehavior.hikerStrategy = strategy;
      actionBehavior.restore(this, stateMap, stateMap.get(actionBehaviorId));
      strategy.actionBehavior = actionBehavior;
    }

    if (dataBehaviorId) {
      const dataBehavior = this.restoreDataBehavior(dataBehaviorId, stateMap);
      dataBehavior.hikerStrategy = strategy;
      dataBehavior.restore(this, stateMap, stateMap.get(dataBehaviorId));
      strategy.dataBehavior = dataBehavior;
    }
  }

  restoreHikerStrategy(id, stateMap, state) {
    const type = getEndType(state);
    const { options } = state;
    return createHikerStrategyClass(type, options);
  }

  restoreHiker(trail, id, stateMap) {
    const state = stateMap.get(id);
    const strategy = this.restoreHikerStrategy(id, stateMap, state);

    const hiker = new Hiker(id, state.name, strategy);
    hiker.trail = trail;
    hiker.restore(this, stateMap, state);

    return hiker;
  }
}

export default RestoreFactory;
