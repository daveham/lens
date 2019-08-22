import { createAction } from 'redux-actions';
import { ACTIONS } from './constants';

// actions
export const requestSimulationsForSource = createAction(ACTIONS.REQUEST_SIMULATIONS_FOR_SOURCE);
export const receiveSimulationsForSource = createAction(ACTIONS.RECEIVE_SIMULATIONS_FOR_SOURCE);
export const requestSimulationsForSourceFailed = createAction(ACTIONS.REQUEST_SIMULATIONS_FOR_SOURCE_FAILED);

export const setActiveScope = createAction(ACTIONS.SET_ACTIVE_SCOPE);

export const ensureEditorTitle = createAction(ACTIONS.ENSURE_EDITOR_TITLE);

export const actions = {
  requestSimulationsForSource,
  receiveSimulationsForSource,
  requestSimulationsForSourceFailed,
  ensureEditorTitle,
};
