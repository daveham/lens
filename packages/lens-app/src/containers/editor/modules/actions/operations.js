import { createActions } from 'redux-actions';

const formatOperationConstants = (entity, op, verb) => [
  `${verb}_${op}_${entity}`,
  `${op}_${entity}_${verb}ED`,
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

const operationEntities = ['SIMULATION', 'EXECUTION', 'RENDERING'];

export const EDITOR_ACTIONS_PREFIX_SIMULATION_OPERATIONS = 'editor-operations';
export const {
  startNewSimulation,
  newSimulationStarted,
  finishNewSimulation,
  newSimulationFinished,
  cancelNewSimulation,
  newSimulationCanceled,

  startEditSimulation,
  editSimulationStarted,
  finishEditSimulation,
  editSimulationFinished,
  cancelEditSimulation,
  editSimulationCanceled,

  startDeleteSimulation,
  deleteSimulationStarted,
  finishDeleteSimulation,
  deleteSimulationFinished,
  cancelDeleteSimulation,
  deleteSimulationCanceled,

  startNewExecution,
  newExecutionStarted,
  finishNewExecution,
  newExecutionFinished,
  cancelNewExecution,
  newExecutionCanceled,

  startEditExecution,
  editExecutionStarted,
  finishEditExecution,
  editExecutionFinished,
  cancelEditExecution,
  editExecutionCanceled,

  startDeleteExecution,
  deleteExecutionStarted,
  finishDeleteExecution,
  deleteExecutionFinished,
  cancelDeleteExecution,
  deleteExecutionCanceled,

  startNewRendering,
  newRenderingStarted,
  finishNewRendering,
  newRenderingFinished,
  cancelNewRendering,
  newRenderingCanceled,

  startEditRendering,
  editRenderingStarted,
  finishEditRendering,
  editRenderingFinished,
  cancelEditRendering,
  editRenderingCanceled,

  startDeleteRendering,
  deleteRenderingStarted,
  finishDeleteRendering,
  deleteRenderingFinished,
  cancelDeleteRendering,
  deleteRenderingCanceled,

  startViewSimulation,
  viewSimulationStarted,
  startViewExecution,
  viewExecutionStarted,
  startViewRendering,
  viewRenderingStarted,
} = createActions(
  ...generateOperationConstants(operationEntities),
  ...generateViewOperationConstants(operationEntities),
  {
    prefix: EDITOR_ACTIONS_PREFIX_SIMULATION_OPERATIONS,
  },
);
