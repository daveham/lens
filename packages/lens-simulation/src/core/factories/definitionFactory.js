import invariant from 'tiny-invariant';

import Hike, { NullHikeStrategy } from '../hikes/hike';
import Simulation from '../simulation';

import Trail, { mixTrailStrategy, NullTrailStrategy } from '../trails/trail';
import CoverTrailStrategyMixin from '../trails/coverTrailStrategy';
import LineTrailStrategyMixin from '../trails/lineTrailStrategy';
import LineTrailStateModifier from '../trails/trailStateModifiers/lineTrailStateModifier';
import RowsFirstTrailStateModifier from '../trails/trailStateModifiers/rowsFirstTrailStateModifier';
import ColumnsFirstTrailStateModifier from '../trails/trailStateModifiers/columnsFirstTrailStateModifier';

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

import { extractTypeAndOptions } from './utils';

import getDebugLog from './debugLog';
const debug = getDebugLog('definitionFactory');

class DefinitionFactory {
  simulationFactory;

  constructor(simulationFactory) {
    this.simulationFactory = simulationFactory;
  }

  createSimulation(id, executionId, definition) {
    const simulation = new Simulation(id, executionId);

    let hike;
    definition.hikes.forEach(hikeDefinition => {
      hike = this.createHike(hikeDefinition);
      hike.simulation = simulation;
      simulation.addHike(hike);
    });

    return simulation;
  }

  // region hike
  createHikeStrategy(definition) {
    const [type, options] = extractTypeAndOptions(definition);
    debug('createHikeStrategy', { type, options });
    return new NullHikeStrategy(options);
  }

  createHike({ trails, id: hikeId, name: hikeName, ...definition }) {
    const strategy = this.createHikeStrategy(definition);
    const [id, name] = this.simulationFactory.buildContext.resolveIdAndName(
      'hike',
      hikeId,
      hikeName,
    );
    const hike = new Hike(id, name, strategy);
    hike.configure(this.simulationFactory.model.size);

    if (trails) {
      trails.forEach(trailDefinition => this.createTrail(hike, trailDefinition));
    }
    return hike;
  }
  // endregion

  // region trail
  createTrailStrategy(params) {
    const [type, options] = extractTypeAndOptions(params);
    debug('createTrailStrategy', { type, options });
    if (type === 'Line') {
      const LineTrailStrategy = mixTrailStrategy(LineTrailStrategyMixin);
      return new LineTrailStrategy(options);
    } else if (type === 'Cover') {
      const CoverTrailStrategy = mixTrailStrategy(CoverTrailStrategyMixin);
      return new CoverTrailStrategy(options);
    }
    return new NullTrailStrategy(options);
  }

  createTrail(hike, { hikers, modifiers, id: trailId, name: trailName, ...definition }) {
    const strategy = this.createTrailStrategy(definition);
    const [id, name] = this.simulationFactory.buildContext.resolveIdAndName(
      'trail',
      trailId,
      trailName,
    );
    const trail = new Trail(id, name, strategy);
    trail.hike = hike;

    if (modifiers) {
      modifiers.forEach(({ type, id: modifierId, name: modifierName, options }) => {
        const [id, name] = this.simulationFactory.buildContext.resolveIdAndName(
          'modifier',
          modifierId,
          modifierName,
        );
        switch (type) {
          case 'Line':
            trail.addModifier(new LineTrailStateModifier(id, name, options));
            break;
          case 'RowsFirst':
            trail.addModifier(new RowsFirstTrailStateModifier(id, name, options));
            break;
          case 'ColumnsFirst':
            trail.addModifier(new ColumnsFirstTrailStateModifier(id, name, options));
            break;
          default:
            invariant(true, `Unsupported trail state modifier type '${type};`);
        }
      });
    }

    hike.addTrail(trail);
    trail.configure(this.simulationFactory.plan);

    if (hikers) {
      hikers.forEach(hikerDefinition => this.createHiker(trail, hikerDefinition));
    }
    return trail;
  }
  // endregion

  // region hiker
  createMovementBehaviorStrategy(definition) {
    const [type, options] = extractTypeAndOptions(definition);
    debug('createMovementBehaviorStrategy', { type, options });
    if (type === 'Trail') {
      const TrailMovementBehaviorStrategy = mixMovementBehaviorStrategy(TrailMovementStrategyMixin);
      return new TrailMovementBehaviorStrategy(options);
    }
    return new NullMovementBehaviorStrategy(options);
  }

  createMovementBehavior({ id: behaviorId, name: behaviorName, ...definition }) {
    debug('createMovementBehavior', definition);
    const strategy = this.createMovementBehaviorStrategy(definition);
    const [id, name] = this.simulationFactory.buildContext.resolveIdAndName(
      'movementBehavior',
      behaviorId,
      behaviorName,
    );
    return new MovementBehavior(id, name, strategy);
  }

  createActionBehaviorStrategy(definition) {
    const [type, options] = extractTypeAndOptions(definition);
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
    return new NullActionBehaviorStrategy(options);
  }

  createActionBehavior({ id: behaviorId, name: behaviorName, ...definition }) {
    debug('createActionBehavior', definition);
    const strategy = this.createActionBehaviorStrategy(definition);
    const [id, name] = this.simulationFactory.buildContext.resolveIdAndName(
      'actionBehavior',
      behaviorId,
      behaviorName,
    );
    return new ActionBehavior(id, name, strategy);
  }

  createDataBehaviorStrategy(definition) {
    const [type, options] = extractTypeAndOptions(definition);
    debug('createDataBehaviorStrategy', { type });
    return new NullDataBehaviorStrategy(options);
  }

  createDataBehavior({ id: behaviorId, name: behaviorName, ...definition }) {
    debug('createDataBehavior', definition);
    const strategy = this.createDataBehaviorStrategy(definition);
    const [id, name] = this.simulationFactory.buildContext.resolveIdAndName(
      'dataBehavior',
      behaviorId,
      behaviorName,
    );
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

  createHikerStrategy(definition) {
    const [type, options, other] = extractTypeAndOptions(definition);
    debug('createHikerStrategy', { type, options, other });
    if (type === 'Trail') {
      const TrailHikerStrategy = mixHikerStrategy(TrailHikerStrategyMixin);
      const strategy = new TrailHikerStrategy(options);
      this.createTrailHikerBehaviors(strategy, other);
      return strategy;
    }
    return new NullHikerStrategy(options);
  }

  createHiker(trail, { id: hikerId, name: hikerName, ...definition }) {
    const strategy = this.createHikerStrategy(definition);
    const [id, name] = this.simulationFactory.buildContext.resolveIdAndName(
      'hiker',
      hikerId,
      hikerName,
    );
    const hiker = new Hiker(id, name, strategy);
    hiker.trail = trail;
    trail.addHiker(hiker);
    return hiker;
  }
  // endregion
}

export default DefinitionFactory;
