import invariant from 'tiny-invariant';

import Simulation from '../simulation';

import Hike, { NullHikeStrategy } from '../hikes/hike';

import Trail, { mixTrailStrategy, NullTrailStrategy } from '../trails/trail';
import CoverTrailStrategyMixin from '../trails/coverTrailStrategy';
import LineTrailStrategyMixin from '../trails/lineTrailStrategy';
import ColumnsFirstTrailStateModifier from '../trails/trailStateModifiers/columnsFirstTrailStateModifier';
import LineTrailStateModifier from '../trails/trailStateModifiers/lineTrailStateModifier';
import RowsFirstTrailStateModifier from '../trails/trailStateModifiers/rowsFirstTrailStateModifier';

import Hiker, { mixHikerStrategy, NullHikerStrategy } from '../hikers/hiker';
import TrailHikerStrategyMixin from '../hikers/trailHikerStrategy';
import ActionBehavior, {
  mixActionBehaviorStrategy,
  NullActionBehaviorStrategy,
} from '../hikers/actionBehaviors/actionBehavior';
import RecordActionStrategyMixin from '../hikers/actionBehaviors/recordActionStrategy';
import TraceActionStrategyMixin from '../hikers/actionBehaviors/traceActionStrategy';
import DataBehavior, { NullDataBehaviorStrategy } from '../hikers/dataBehaviors/dataBehavior';
import MovementBehavior, {
  mixMovementBehaviorStrategy,
  NullMovementBehaviorStrategy,
} from '../hikers/movementBehaviors/movementBehavior';
import TrailMovementStrategyMixin from '../hikers/movementBehaviors/trailMovementStrategy';

import { extractTypeAndOptions, getEndType } from './utils';

import getDebugLog from './debugLog';
const debug = getDebugLog('objectFactory');

class RestoreFactory {
  stateMap;

  constructor() {
    this.stateMap = new Map();
  }

  restoreSimulation(id, executionId, stateMap) {
    const simulation = new Simulation(id, executionId);
    simulation.restore(this, stateMap);

    return simulation;
  }

  restoreHikeStrategy(id, stateMap, state) {
    const [, options] = extractTypeAndOptions(state);
    const type = getEndType(state);
    debug('restoreHikeStrategy', { type, options });
    return new NullHikeStrategy(options);
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
    debug('restoreTrailStrategy', { type, options });
    if (type === 'Line') {
      const LineTrailStrategy = mixTrailStrategy(LineTrailStrategyMixin);
      return new LineTrailStrategy(options);
    } else if (type === 'Cover') {
      const CoverTrailStrategy = mixTrailStrategy(CoverTrailStrategyMixin);
      return new CoverTrailStrategy(options);
    } else {
      return new NullTrailStrategy(options);
    }
  }

  restoreTrailModifier(trail, id, stateMap) {
    const state = stateMap.get(id);
    const type = getEndType(state);
    const { options } = state;
    debug('restoreTrailModifier', { type, options });
    let modifier;
    switch (type) {
      case 'Line':
        modifier = new LineTrailStateModifier(id, state.name, options);
        break;
      case 'RowsFirst':
        modifier = new RowsFirstTrailStateModifier(id, state.name, options);
        break;
      case 'ColumnsFirst':
        modifier = new ColumnsFirstTrailStateModifier(id, state.name, options);
        break;
      default:
        invariant(true, `Unsupported trail state modifier type '${type};`);
    }
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
    debug('restoreMovementBehaviorStrategy', { type });
    if (type === 'Trail') {
      const TrailMovementBehaviorStrategy = mixMovementBehaviorStrategy(TrailMovementStrategyMixin);
      return new TrailMovementBehaviorStrategy(options);
    }
    return new NullMovementBehaviorStrategy(options);
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
    debug('restoreActionBehaviorStrategy', { type });
    if (type === 'Trace') {
      const TraceActionBehaviorStrategy = mixActionBehaviorStrategy(TraceActionStrategyMixin);
      return new TraceActionBehaviorStrategy(options);
    } else if (type === 'Record') {
      const RecordActionBehaviorStrategy = options.trace
        ? mixActionBehaviorStrategy(RecordActionStrategyMixin, TraceActionStrategyMixin)
        : mixActionBehaviorStrategy(RecordActionStrategyMixin);
      return new RecordActionBehaviorStrategy(options);
    }
    return new NullActionBehaviorStrategy(options);
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
    debug('restoreDataBehaviorStrategy', { type });
    return new NullDataBehaviorStrategy(options);
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
    debug('restoreHikerStrategy', { type });
    if (type === 'Trail') {
      const TrailHikerStrategy = mixHikerStrategy(TrailHikerStrategyMixin);
      return new TrailHikerStrategy(options);
    }
    return new NullHikerStrategy(options);
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
