import yaml from 'js-yaml';

import SimulationFactory from './factories/simulationFactory';

import buildContext from './buildContext';

import getDebugLog from './debugLog';

const debug = getDebugLog('simulationBuilder');

export function parse(document, options = {}) {
  const doc = yaml.safeLoad(document);
  debug('parse', { doc: JSON.stringify(doc), options });
  return doc;
}

export function build(executionId, simulationId, definition, { plan, model, inventory }) {
  const factory = new SimulationFactory(buildContext);
  factory.initialize(plan, model, inventory);
  return factory.createSimulationFromDefinition(simulationId, executionId, definition);
}

export function suspend(simulation) {
  const factory = new SimulationFactory(buildContext);
  return factory.suspendSimulationFromObject(simulation);
}

export function restore(executionId, simulationId, stateMap, { plan, model, inventory }) {
  const factory = new SimulationFactory(buildContext);
  factory.initialize(plan, model, inventory);
  return factory.restoreSimulationFromMap(simulationId, executionId, stateMap);
}
