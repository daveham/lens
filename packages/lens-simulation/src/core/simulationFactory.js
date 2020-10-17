import invariant from 'tiny-invariant';
import RecordActionStrategyMixin from './hikers/actionBehaviors/recordActionStrategy';

import Hike, { NullHikeStrategy } from './hikes/hike';

import Trail, { mixTrailStrategy, NullTrailStrategy } from './trails/trail';
import LineTrailStrategyMixin from './trails/lineTrailStrategy';
import CoverTrailStrategyMixin from './trails/coverTrailStrategy';
import LineTrailStateModifier from './trails/trailStateModifiers/lineTrailStateModifier';
import RowsFirstTrailStateModifier from './trails/trailStateModifiers/rowsFirstTrailStateModifier';
import ColumnsFirstTrailStateModifier from './trails/trailStateModifiers/columnsFirstTrailStateModifier';

import Hiker, { mixHikerStrategy, NullHikerStrategy } from './hikers/hiker';
import TrailHikerStrategyMixin from './hikers/trailHikerStrategy';
import MovementBehavior, {
  mixMovementBehaviorStrategy,
} from './hikers/movementBehaviors/movementBehavior';
import TrailMovementStrategyMixin from './hikers/movementBehaviors/trailMovementStrategy';
import ActionBehavior, { mixActionBehaviorStrategy } from './hikers/actionBehaviors/actionBehavior';
import TraceActionStrategyMixin from './hikers/actionBehaviors/traceActionStrategy';
import DataBehavior from './hikers/dataBehaviors/dataBehavior';

import getDebugLog from './debugLog';
const debug = getDebugLog('simulationFactory');

let idCounter = 0;
function getNextId() {
  idCounter += 1;
  return idCounter;
}

function extractIdAndName(label, { id, name, ...definition }) {
  const resolvedId = id || getNextId();
  const resolvedName = name || `${label}-${resolvedId}`;
  return [resolvedId, resolvedName, definition];
}

function extractTypeAndOptions({ type, options, ...other }) {
  return [type, options, other];
}

class SimulationFactory {
  initialize(plan, model, inventory = []) {
    this.plan = plan;
    this.model = model;
    this.inventory = inventory;
  }

  createHikeStrategy(params) {
    const [type, options] = extractTypeAndOptions(params);
    debug('createHikeStrategy', { type, options });
    return new NullHikeStrategy(options);
  }

  createHike(params) {
    const [id, name, definition] = extractIdAndName('hike', params);
    const strategy = this.createHikeStrategy(definition);
    const hike = new Hike(id, name, this.model.size, strategy);
    strategy.hike = hike;
    return hike;
  }

  createTrailStrategy(params) {
    const [type, options] = extractTypeAndOptions(params);
    if (type === 'Line') {
      const LineTrailStrategy = mixTrailStrategy(LineTrailStrategyMixin);
      return new LineTrailStrategy(options);
    } else if (type === 'Cover') {
      const CoverTrailStrategy = mixTrailStrategy(CoverTrailStrategyMixin);
      return new CoverTrailStrategy(options);
    }
    return new NullTrailStrategy(options);
  }

  createTrailStateModifiers(trail, { modifiers }) {
    if (modifiers) {
      modifiers.forEach(({ type, options }) => {
        debug('createTrailStateModifiers, creating type', type);
        switch (type) {
          case 'Line':
            trail.addModifier(new LineTrailStateModifier());
            break;
          case 'RowsFirst':
            trail.addModifier(new RowsFirstTrailStateModifier(options));
            break;
          case 'ColumnsFirst':
            trail.addModifier(new ColumnsFirstTrailStateModifier(options));
            break;
          default:
            invariant(true, `Unsupported trail state modifier type '${type};`);
        }
      });
    }
  }

  createTrail(params) {
    const [id, name, definition] = extractIdAndName('trail', params);
    const strategy = this.createTrailStrategy(definition);
    const trail = new Trail(id, name, strategy);
    strategy.trail = trail;
    this.createTrailStateModifiers(trail, definition);
    return trail;
  }

  createMovementBehaviorStrategy(params) {
    const [type, options] = extractTypeAndOptions(params);
    debug('createMovementBehaviorStrategy', { type });
    if (type === 'Trail') {
      const TrailMovementBehaviorStrategy = mixMovementBehaviorStrategy(TrailMovementStrategyMixin);
      return new TrailMovementBehaviorStrategy(options);
    }
    return null;
  }

  createMovementBehavior(params) {
    const [id, name, definition] = extractIdAndName('movementBehavior', params);
    debug('createMovementBehavior', definition);
    const strategy = this.createMovementBehaviorStrategy(definition);
    return new MovementBehavior(id, name, strategy);
  }

  createActionBehaviorStrategy(params) {
    const [type, options] = extractTypeAndOptions(params);
    debug('createActionBehaviorStrategy', { type });
    if (type === 'Trace') {
      const TraceActionBehaviorStrategy = mixActionBehaviorStrategy(TraceActionStrategyMixin);
      return new TraceActionBehaviorStrategy(options);
    } else if (type === 'Record') {
      const RecordActionBehaviorStrategy = options.trace
        ? mixActionBehaviorStrategy(RecordActionStrategyMixin, TraceActionStrategyMixin)
        : mixActionBehaviorStrategy(RecordActionStrategyMixin);
      return new RecordActionBehaviorStrategy(options);
    }
    return null;
  }

  createActionBehavior(params) {
    const [id, name, definition] = extractIdAndName('actionBehavior', params);
    debug('createActionBehavior', definition);
    const strategy = this.createActionBehaviorStrategy(definition);
    return new ActionBehavior(id, name, strategy);
  }

  createDataBehaviorStrategy() {
    return null;
  }

  createDataBehavior(params) {
    const [id, name, definition] = extractIdAndName('dataBehavior', params);
    const strategy = this.createDataBehaviorStrategy(definition);
    return new DataBehavior(id, name, strategy);
  }

  createTrailHikerBehaviors(strategy, { movementBehavior, actionBehavior, dataBehavior }) {
    let behavior;
    if (movementBehavior) {
      behavior = this.createMovementBehavior(movementBehavior);
      behavior.hikerStrategy = strategy;
      strategy.movementBehavior = behavior;
    }

    if (actionBehavior) {
      behavior = this.createActionBehavior(actionBehavior);
      behavior.hikerStrategy = strategy;
      strategy.actionBehavior = behavior;
    }

    if (dataBehavior) {
      behavior = this.createDataBehavior(dataBehavior);
      behavior.hikerStrategy = strategy;
      strategy.dataBehavior = behavior;
    }
  }

  createHikerStrategy(params) {
    const [type, options, other] = extractTypeAndOptions(params);
    if (type === 'Trail') {
      const TrailHikerStrategy = mixHikerStrategy(TrailHikerStrategyMixin);
      const strategy = new TrailHikerStrategy(options);
      this.createTrailHikerBehaviors(strategy, other);
      return strategy;
    }
    return new NullHikerStrategy(options);
  }

  createHiker(params) {
    const [id, name, definition] = extractIdAndName('hiker', params);
    const strategy = this.createHikerStrategy(definition);
    const hiker = new Hiker(id, name, strategy);
    strategy.hiker = hiker;
    return hiker;
  }
}

export default SimulationFactory;
