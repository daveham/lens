import { createAction } from 'redux-actions';
import { ACTIONS } from './constants';

// actions
export const requestSimulationsForSource = createAction(ACTIONS.REQUEST_SIMULATIONS_FOR_SOURCE);
export const receiveSimulationsForSource = createAction(ACTIONS.RECEIVE_SIMULATIONS_FOR_SOURCE);
export const requestSimulationsForSourceFailed = createAction(ACTIONS.REQUEST_SIMULATIONS_FOR_SOURCE_FAILED);

export const requestHikes = createAction(ACTIONS.REQUEST_HIKES);
export const receiveHikes = createAction(ACTIONS.RECEIVE_HIKES);
export const requestHikesFailed = createAction(ACTIONS.REQUEST_HIKES_FAILED);

export const setForm = createAction(ACTIONS.SET_FORM);
export const updateForm = createAction(ACTIONS.UPDATE_FORM);
export const setDetailForm = createAction(ACTIONS.SET_DETAIL_FORM);
export const updateDetailForm = createAction(ACTIONS.UPDATE_DETAIL_FORM);

export const setActiveScope = createAction(ACTIONS.SET_ACTIVE_SCOPE);

export const ensureEditorTitle = createAction(ACTIONS.ENSURE_EDITOR_TITLE);

export const actions = {
  requestSimulationsForSource,
  receiveSimulationsForSource,
  requestSimulationsForSourceFailed,
  requestHikes,
  receiveHikes,
  requestHikesFailed,
  setForm,
  updateForm,
  setDetailForm,
  updateDetailForm,
  ensureEditorTitle,
};
