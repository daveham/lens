import invariant from 'tiny-invariant';
import ActionBehavior from './hikers/actionBehaviors/actionBehavior';
import DataBehavior from './hikers/dataBehaviors/dataBehavior';
import MovementBehavior, {
  mixMovementBehaviorStrategy,
} from './hikers/movementBehaviors/movementBehavior';
import TrailMovementStrategyMixin from './hikers/movementBehaviors/trailMovementStrategy';
import TrailHikerStrategyMixin from './hikers/trailHikerStrategy';
import CoverTrailStrategyMixin from './trails/coverTrailStrategy';
import LineTrailStrategyMixin from './trails/lineTrailStrategy';
import Hike, { NullHikeStrategy } from './hikes/hike';
import Trail, { mixTrailStrategy, NullTrailStrategy } from './trails/trail';
import Hiker, { mixHikerStrategy, NullHikerStrategy } from './hikers/hiker';

import ColumnsFirstTrailStateModifier from './trails/trailStateModifiers/columnsFirstTrailStateModifier';
import LineTrailStateModifier from './trails/trailStateModifiers/lineTrailStateModifier';
import RowsFirstTrailStateModifier from './trails/trailStateModifiers/rowsFirstTrailStateModifier';

import getDebugLog from './debugLog';
const debug = getDebugLog('simulationFactory');

let idCounter = 0;
function getNextId() {
  idCounter += 1;
  return idCounter;
}

class SimulationFactory {
  initialize(plan, model, inventory = []) {
    this.plan = plan;
    this.model = model;
    this.inventory = inventory;
  }

  createHikeStrategy({ options }) {
    return new NullHikeStrategy(options);
  }

  createHike(definition) {
    const id = definition.id || getNextId();
    const name = definition.name || `hike-${id}`;
    const strategy = this.createHikeStrategy(definition);
    const hike = new Hike(id, name, this.model.size, strategy);
    strategy.hike = hike;
    return hike;
  }

  createTrailStrategy({ type, options }) {
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
      modifiers.forEach(definition => {
        switch (definition.type) {
          case 'Line':
            trail.modifiers.push(new LineTrailStateModifier());
            break;
          case 'RowsFirst':
            trail.modifiers.push(new RowsFirstTrailStateModifier());
            break;
          case 'ColumnsFirst':
            trail.modifiers.push(new ColumnsFirstTrailStateModifier());
            break;
          default:
            invariant(true, `Unsupported trail state modifier type '${definition.type};`);
        }
      });
    }
  }

  createTrail(definition) {
    const id = definition.id || getNextId();
    const name = definition.name || `trail-${id}`;
    const strategy = this.createTrailStrategy(definition);
    const trail = new Trail(id, name, strategy);
    strategy.trail = trail;
    this.createTrailStateModifiers(trail, definition);
    return trail;
  }

  createMovementBehaviorStrategy({ type, options }) {
    if (type === 'Trail') {
      const TrailMovementBehaviorStrategy = mixMovementBehaviorStrategy(TrailMovementStrategyMixin);
      return new TrailMovementBehaviorStrategy(options);
    }
    return null;
  }

  createMovementBehavior(definition) {
    debug('createMovementBehavior', definition);
    const id = definition.id || getNextId();
    const name = definition.name || `movementBehavior-${id}`;
    const strategy = this.createMovementBehaviorStrategy(definition);
    return new MovementBehavior(id, name, strategy);
  }

  createActionBehaviorStrategy() {
    return null;
  }

  createActionBehavior(definition) {
    const id = definition.id || getNextId();
    const name = definition.name || `actionBehavior-${id}`;
    const strategy = this.createActionBehaviorStrategy(definition);
    return new ActionBehavior(id, name, strategy);
  }

  createDataBehaviorStrategy() {
    return null;
  }

  createDataBehavior(definition) {
    const id = definition.id || getNextId();
    const name = definition.name || `dataBehavior-${id}`;
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

  createHikerStrategy({ type, options, ...other }) {
    if (type === 'Trail') {
      const TrailHikerStrategy = mixHikerStrategy(TrailHikerStrategyMixin);
      const strategy = new TrailHikerStrategy(options);
      this.createTrailHikerBehaviors(strategy, other);
      return strategy;
    }
    return new NullHikerStrategy(options);
  }

  createHiker(definition) {
    const id = definition.id || getNextId();
    const name = definition.name || `hiker-${id}`;
    const strategy = this.createHikerStrategy(definition);
    const hiker = new Hiker(id, name, strategy);
    strategy.hiker = hiker;
    return hiker;
  }
}

export default SimulationFactory;
