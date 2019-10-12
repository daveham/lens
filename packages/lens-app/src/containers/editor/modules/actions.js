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
} = createActions(
  'REQUEST_SIMULATIONS_FOR_SOURCE',
  'RECEIVE_SIMULATIONS_FOR_SOURCE',
  'REQUEST_SIMULATIONS_FOR_SOURCE_FAILED',
  'REQUEST_HIKES',
  'RECEIVE_HIKES',
  'REQUEST_HIKES_FAILED',
  {
    prefix: EDITOR_ACTIONS_PREFIX_SIMULATION_DATA,
  },
);

export const EDITOR_ACTIONS_PREFIX_SIMULATION_EDIT = 'editor-simulation-edit';
export const {
  setSimulation,
  updateSimulation,
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
  'SET_SIMULATION',
  'UPDATE_SIMULATION',
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

export const EDITOR_ACTIONS_PREFIX_SIMULATION_OPERATIONS = 'editor-operations';
export const {
  startNewSimulation,
  finishNewSimulation,
  cancelNewSimulation,
  startEditSimulation,
  finishEditSimulation,
  cancelEditSimulation,
} = createActions(
  'START_NEW_SIMULATION',
  'FINISH_NEW_SIMULATION',
  'CANCEL_NEW_SIMULATION',
  'START_EDIT_SIMULATION',
  'FINISH_EDIT_SIMULATION',
  'CANCEL_EDIT_SIMULATION',
  {
    prefix: EDITOR_ACTIONS_PREFIX_SIMULATION_OPERATIONS,
  },
);

export const {
  setActiveScope,
  ensureEditorTitle,
  editorActionEnabled,
  editorActionDisabled,
  editorActionValid,
  editorActionInvalid,
} = createActions(
  'SET_ACTIVE_SCOPE',
  'ENSURE_EDITOR_TITLE',
  'EDITOR_ACTION_ENABLED',
  'EDITOR_ACTION_DISABLED',
  'EDITOR_ACTION_VALID',
  'EDITOR_ACTION_INVALID',
  {
    prefix: 'editor',
  },
);
