import DefinitionFactory from './definitionFactory';
import RestoreFactory from './restoreFactory';
import SuspendFactory from './suspendFactory';

// import getDebugLog from './debugLog';
// const debug = getDebugLog('simulationFactory');

class SimulationFactory {
  buildContext;

  constructor(buildContext) {
    this.buildContext = buildContext;
  }

  initialize(plan, model, inventory = []) {
    this.plan = plan;
    this.model = model;
    this.inventory = inventory;
  }

  createSimulationFromDefinition(id, executionId, definition) {
    const definitionFactory = new DefinitionFactory(this);
    return definitionFactory.createSimulation(id, executionId, definition);
  }

  suspendSimulationFromObject(simulation) {
    const suspendFactory = new SuspendFactory();
    suspendFactory.suspendSimulation(simulation);
    return suspendFactory.stateMap;
  }

  restoreSimulationFromMap(id, executionId, stateMap) {
    const objectFactory = new RestoreFactory();
    return objectFactory.restoreSimulation(id, executionId, stateMap);
  }
}

export default SimulationFactory;
