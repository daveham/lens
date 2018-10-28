import { createAction } from 'redux-actions';
import { ACTIONS } from './constants';

// actions
export const ensureEditorTitle = createAction(ACTIONS.ENSURE_EDITOR_TITLE);

export const actions = {
  ensureEditorTitle,
};
