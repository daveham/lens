import Simulation from '../simulation';
// import getDebugLog from './debugLog';
import {
  createActionBehaviorClass,
  createDataBehaviorClass,
  createHikeClass,
  createHikerClass,
  createMovementBehaviorClass,
  createTrailClass,
  createTrailModifierClass,
} from './classFactory';
import { extractTypeAndOptions } from './utils';

// const debug = getDebugLog('definitionFactory');

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

  createHike({ trails, id: hikeId, name: hikeName, ...definition }) {
    const [type, options] = extractTypeAndOptions(definition);
    const [id, name] = this.simulationFactory.buildContext.resolveIdAndName(
      'hike',
      hikeId,
      hikeName,
    );
    const hike = createHikeClass(id, name, type, options);
    hike.configure(this.simulationFactory.model.size);

    if (trails) {
      trails.forEach(trailDefinition => this.createTrail(hike, trailDefinition));
    }
    return hike;
  }

  // endregion

  // region trail
  createTrail(hike, { hikers, modifiers, id: trailId, name: trailName, ...definition }) {
    const [type, options] = extractTypeAndOptions(definition);
    const [id, name] = this.simulationFactory.buildContext.resolveIdAndName(
      'trail',
      trailId,
      trailName,
    );
    const trail = createTrailClass(id, name, type, options);
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
  createMovementBehavior({ id: behaviorId, name: behaviorName, type, options }) {
    const [id, name] = this.simulationFactory.buildContext.resolveIdAndName(
      'movementBehavior',
      behaviorId,
      behaviorName,
    );
    return createMovementBehaviorClass(id, name, type, options);
  }

  createActionBehavior({ id: behaviorId, name: behaviorName, ...definition }) {
    const [type, options] = extractTypeAndOptions(definition);
    const [id, name] = this.simulationFactory.buildContext.resolveIdAndName(
      'actionBehavior',
      behaviorId,
      behaviorName,
    );
    return createActionBehaviorClass(id, name, type, options);
  }

  createDataBehavior({ id: behaviorId, name: behaviorName, ...definition }) {
    const [type, options] = extractTypeAndOptions(definition);
    const [id, name] = this.simulationFactory.buildContext.resolveIdAndName(
      'dataBehavior',
      behaviorId,
      behaviorName,
    );
    return createDataBehaviorClass(id, name, type, options);
  }

  createTrailHikerBehaviors(hiker, { movementBehavior, actionBehavior, dataBehavior }) {
    let behavior;
    if (movementBehavior) {
      behavior = this.createMovementBehavior(movementBehavior);
      behavior.hiker = hiker;
      hiker.movementBehavior = behavior;
    }

    if (actionBehavior) {
      behavior = this.createActionBehavior(actionBehavior);
      behavior.hiker = hiker;
      hiker.actionBehavior = behavior;
    }

    if (dataBehavior) {
      behavior = this.createDataBehavior(dataBehavior);
      behavior.hiker = hiker;
      hiker.dataBehavior = behavior;
    }
  }

  createHiker(trail, { id: hikerId, name: hikerName, type, options, ...definition }) {
    const [id, name] = this.simulationFactory.buildContext.resolveIdAndName(
      'hiker',
      hikerId,
      hikerName,
    );
    const hiker = createHikerClass(id, name, type, options);
    hiker.trail = trail;
    if (type === 'Trail') {
      this.createTrailHikerBehaviors(hiker, definition);
    }
    trail.addHiker(hiker);
    return hiker;
  }

  // endregion
}

export default DefinitionFactory;
