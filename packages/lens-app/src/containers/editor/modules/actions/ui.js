import { createActions } from 'redux-actions';

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

export const { setActiveScope, ensureEditorTitle, editorActionValid } = createActions(
  'SET_ACTIVE_SCOPE',
  'ENSURE_EDITOR_TITLE',
  'EDITOR_ACTION_VALID',
  {
    prefix: 'editor',
  },
);
