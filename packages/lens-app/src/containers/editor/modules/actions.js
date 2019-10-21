import { createActions } from 'redux-actions';

export const EDITOR_ACTIONS_PREFIX_SIMULATION_SAGAS = 'editor-simulation-sagas';
export const {
  changeSimulation,
  changeHike,
  changeHikeList,
  changeTrail,
  changeTrailList,
  changeHiker,
  changeHikerList,
} = createActions(
  'CHANGE_SIMULATION',
  'CHANGE_HIKE',
  'CHANGE_HIKE_LIST',
  'CHANGE_TRAIL',
  'CHANGE_TRAIL_LIST',
  'CHANGE_HIKER',
  'CHANGE_HIKER_LIST',
  {
    prefix: EDITOR_ACTIONS_PREFIX_SIMULATION_SAGAS,
  },
);

export const EDITOR_ACTIONS_PREFIX_SIMULATION_DATA = 'editor-simulation-data';
export const {
  requestSimulationsForSource,
  receiveSimulationsForSource,
  requestSimulationsForSourceFailed,
  requestHikes,
  receiveHikes,
  requestHikesFailed,
  saveSimulation,
  saveSimulationSucceeded,
  saveSimulationFailed,
} = createActions(
  'REQUEST_SIMULATIONS_FOR_SOURCE',
  'RECEIVE_SIMULATIONS_FOR_SOURCE',
  'REQUEST_SIMULATIONS_FOR_SOURCE_FAILED',
  'REQUEST_HIKES',
  'RECEIVE_HIKES',
  'REQUEST_HIKES_FAILED',
  'SAVE_SIMULATION',
  'SAVE_SIMULATION_SUCCEEDED',
  'SAVE_SIMULATION_FAILED',
  {
    prefix: EDITOR_ACTIONS_PREFIX_SIMULATION_DATA,
  },
);

export const EDITOR_ACTIONS_PREFIX_SIMULATION_EDIT = 'editor-simulation-edit';
export const {
  setSelectedSimulation,
  updateSelectedSimulation,
  addHike,
  updateHike,
  updateHikes,
  addTrail,
  updateTrail,
  updateTrails,
  addHiker,
  updateHiker,
  updateHikers,
} = createActions(
  'SET_SELECTED_SIMULATION',
  'UPDATE_SELECTED_SIMULATION',
  'ADD_HIKE',
  'UPDATE_HIKE',
  'UPDATE_HIKES',
  'ADD_TRAIL',
  'UPDATE_TRAIL',
  'UPDATE_TRAILS',
  'ADD_HIKER',
  'UPDATE_HIKER',
  'UPDATE_HIKERS',
  {
    prefix: EDITOR_ACTIONS_PREFIX_SIMULATION_EDIT,
  },
);

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

export const { setActiveScope, ensureEditorTitle, editorActionValid } = createActions(
  'SET_ACTIVE_SCOPE',
  'ENSURE_EDITOR_TITLE',
  'EDITOR_ACTION_VALID',
  {
    prefix: 'editor',
  },
);
