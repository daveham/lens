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
import { extractTypeAndOptions } from './utils';

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
    return createHikeStrategyClass(type, options);
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
    return createTrailStrategyClass(type, options);
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
        trail.addModifier(createTrailModifierClass(type, id, name, options));
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
    return createMovementBehaviorStrategyClass(type, options);
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
    return createActionBehaviorStrategyClass(type, options);
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
    return createDataBehaviorStrategyClass(type, options);
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
    const strategy = createHikerStrategyClass(type, options);
    if (type === 'Trail') {
      this.createTrailHikerBehaviors(strategy, other);
    }
    return strategy;
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
