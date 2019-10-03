import { createAction, createActions } from 'redux-actions';
import { ACTIONS } from './constants';

export const {
  requestSimulationsForSource,
  receiveSimulationsForSource,
  requestSimulationsForSourceFailed,
  requestHikes,
  receiveHikes,
  requestHikesFailed,
  changeSimulation,
  changeHike,
  changeHikeList,
  changeTrail,
  changeTrailList,
  changeHiker,
  changeHikerList,
} = createActions(
  'REQUEST_SIMULATIONS_FOR_SOURCE',
  'RECEIVE_SIMULATIONS_FOR_SOURCE',
  'REQUEST_SIMULATIONS_FOR_SOURCE_FAILED',
  'REQUEST_HIKES',
  'RECEIVE_HIKES',
  'REQUEST_HIKES_FAILED',
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

export const setSimulation = createAction(ACTIONS.SET_SIMULATION);
export const updateSimulation = createAction(ACTIONS.UPDATE_SIMULATION);

export const updateHike = createAction(ACTIONS.UPDATE_HIKE);
export const updateHikes = createAction(ACTIONS.UPDATE_HIKES);
export const updateTrail = createAction(ACTIONS.UPDATE_TRAIL);
export const updateTrails = createAction(ACTIONS.UPDATE_TRAILS);
export const updateHiker = createAction(ACTIONS.UPDATE_HIKER);
export const updateHikers = createAction(ACTIONS.UPDATE_HIKERS);

export const setActiveScope = createAction(ACTIONS.SET_ACTIVE_SCOPE);

export const ensureEditorTitle = createAction(ACTIONS.ENSURE_EDITOR_TITLE);

export const actions = {
  setSimulation,
  updateSimulation,
  ensureEditorTitle,
};
