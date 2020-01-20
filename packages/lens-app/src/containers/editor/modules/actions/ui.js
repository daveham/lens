import { createActions } from 'redux-actions';

export const EDITOR_ACTIONS_PREFIX_SIMULATION_EDIT = 'editor-simulation-edit';
export const {
  setSnackbarMessage,
  setSnackbarErrorMessage,
  clearSnackbarMessage,
  clearEditor,
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
  setSelectedExecution,
  updateSelectedExecution,
  setSelectedRendering,
  updateSelectedRendering,
} = createActions(
  'SET_SNACKBAR_MESSAGE',
  'SET_SNACKBAR_ERROR_MESSAGE',
  'CLEAR_SNACKBAR_MESSAGE',
  'CLEAR_EDITOR',
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
  'SET_SELECTED_EXECUTION',
  'UPDATE_SELECTED_EXECUTION',
  'SET_SELECTED_RENDERING',
  'UPDATE_SELECTED_RENDERING',
  {
    prefix: EDITOR_ACTIONS_PREFIX_SIMULATION_EDIT,
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
