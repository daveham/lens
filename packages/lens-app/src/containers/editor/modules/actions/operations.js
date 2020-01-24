import { createActions } from 'redux-actions';

const formatOperationConstants = (entity, op, verb, suffix = 'ED') => [
  `${verb}_${op}_${entity}`,
  `${op}_${entity}_${verb}${suffix}`,
];

function generateOperationConstants(entities) {
  const ops = ['NEW', 'EDIT', 'DELETE'];
  const verbs = ['START', 'FINISH', 'CANCEL'];
  return entities
    .map(entity => ops.map(op => verbs.map(verb => formatOperationConstants(entity, op, verb))))
    .flat(3);
}

function generateViewOperationConstants(entities) {
  const op = 'VIEW';
  const verb = 'START';
  return entities.map(entity => formatOperationConstants(entity, op, verb)).flat(1);
}

function generateRunAndRenderOperationConstants() {
  return [
    formatOperationConstants('EXECUTION', 'RUN', 'START'),
    formatOperationConstants('EXECUTION', 'RUN', 'CANCEL'),
    formatOperationConstants('RENDERING', 'RENDER', 'START'),
    formatOperationConstants('RENDERING', 'RENDER', 'CANCEL'),
  ].flat(2);
}

const operationEntities = ['SIMULATION', 'EXECUTION', 'RENDERING'];

export const EDITOR_ACTIONS_PREFIX_SIMULATION_OPERATIONS = 'editor-operations';
export const {
  // new simulation
  startNewSimulation,
  newSimulationStarted,
  finishNewSimulation,
  newSimulationFinished,
  cancelNewSimulation,
  newSimulationCanceled,
  // edit simulation
  startEditSimulation,
  editSimulationStarted,
  finishEditSimulation,
  editSimulationFinished,
  cancelEditSimulation,
  editSimulationCanceled,
  // delete simulation
  startDeleteSimulation,
  deleteSimulationStarted,
  finishDeleteSimulation,
  deleteSimulationFinished,
  cancelDeleteSimulation,
  deleteSimulationCanceled,
  // new execution
  startNewExecution,
  newExecutionStarted,
  finishNewExecution,
  newExecutionFinished,
  cancelNewExecution,
  newExecutionCanceled,
  // edit execution
  startEditExecution,
  editExecutionStarted,
  finishEditExecution,
  editExecutionFinished,
  cancelEditExecution,
  editExecutionCanceled,
  // delete execution
  startDeleteExecution,
  deleteExecutionStarted,
  finishDeleteExecution,
  deleteExecutionFinished,
  cancelDeleteExecution,
  deleteExecutionCanceled,
  // new rendering
  startNewRendering,
  newRenderingStarted,
  finishNewRendering,
  newRenderingFinished,
  cancelNewRendering,
  newRenderingCanceled,
  // edit rendering
  startEditRendering,
  editRenderingStarted,
  finishEditRendering,
  editRenderingFinished,
  cancelEditRendering,
  editRenderingCanceled,
  // delete rendering
  startDeleteRendering,
  deleteRenderingStarted,
  finishDeleteRendering,
  deleteRenderingFinished,
  cancelDeleteRendering,
  deleteRenderingCanceled,
  // view simulation
  startViewSimulation,
  viewSimulationStarted,
  // view execution
  startViewExecution,
  viewExecutionStarted,
  // view rendering
  startViewRendering,
  viewRenderingStarted,
  // run and render
  startRunExecution,
  runExecutionStarted,
  cancelRunExecution,
  runExecutionCanceled,
  startRenderRendering,
  renderRenderingStarted,
  cancelRenderRendering,
  renderRenderingCanceled,
} = createActions(
  ...generateOperationConstants(operationEntities),
  ...generateViewOperationConstants(operationEntities),
  ...generateRunAndRenderOperationConstants(),
  {
    prefix: EDITOR_ACTIONS_PREFIX_SIMULATION_OPERATIONS,
  },
);
