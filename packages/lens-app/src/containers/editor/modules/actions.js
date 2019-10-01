import { createAction, createActions } from 'redux-actions';
import { ACTIONS } from './constants';

// actions
export const requestSimulationsForSource = createAction(ACTIONS.REQUEST_SIMULATIONS_FOR_SOURCE);
export const receiveSimulationsForSource = createAction(ACTIONS.RECEIVE_SIMULATIONS_FOR_SOURCE);
export const requestSimulationsForSourceFailed = createAction(ACTIONS.REQUEST_SIMULATIONS_FOR_SOURCE_FAILED);

export const requestHikes = createAction(ACTIONS.REQUEST_HIKES);
export const receiveHikes = createAction(ACTIONS.RECEIVE_HIKES);
export const requestHikesFailed = createAction(ACTIONS.REQUEST_HIKES_FAILED);

export const setSimulation = createAction(ACTIONS.SET_SIMULATION);
export const updateSimulation = createAction(ACTIONS.UPDATE_SIMULATION);

export const editorChangeActions = createActions({},
  'CHANGE_SIMULATION',
  'CHANGE_HIKE',
  'CHANGE_HIKE_LIST',
  'CHANGE_TRAIL',
  'CHANGE_TRAIL_LIST',
  'CHANGE_HIKER',
  'CHANGE_HIKER_LIST',
  {
    prefix: 'editor',
  },
);

export const updateHike = createAction(ACTIONS.UPDATE_HIKE);
export const updateHikes = createAction(ACTIONS.UPDATE_HIKES);
export const updateTrail = createAction(ACTIONS.UPDATE_TRAIL);
export const updateTrails = createAction(ACTIONS.UPDATE_TRAILS);
export const updateHiker = createAction(ACTIONS.UPDATE_HIKER);
export const updateHikers = createAction(ACTIONS.UPDATE_HIKERS);

export const setActiveScope = createAction(ACTIONS.SET_ACTIVE_SCOPE);

export const ensureEditorTitle = createAction(ACTIONS.ENSURE_EDITOR_TITLE);

export const actions = {
  requestSimulationsForSource,
  receiveSimulationsForSource,
  requestSimulationsForSourceFailed,
  requestHikes,
  receiveHikes,
  requestHikesFailed,
  setSimulation,
  updateSimulation,
  ensureEditorTitle,
};
