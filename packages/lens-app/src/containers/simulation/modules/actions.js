import { createAction } from 'redux-actions';
import { ACTIONS } from './constants';

// actions
export const recordPathNames = createAction(ACTIONS.RECORD_PATH_NAMES);

export const actions = {
  recordPathNames
};
