import { combineReducers } from 'redux';
import { ACTIONS } from './constants';
import { InsertableReducerType } from 'modules/types';

// reducers
const simulationsLoading = (state = false, { type }) => {
  switch (type) {
    case ACTIONS.REQUEST_SIMULATIONS_FOR_SOURCE:
      return true;
    case ACTIONS.RECEIVE_SIMULATIONS_FOR_SOURCE:
    case ACTIONS.REQUEST_SIMULATIONS_FOR_SOURCE_FAILED:
      return false;
    default:
      return state;
  }
};

const initialSimulationsState = [];
const simulations = (state = initialSimulationsState, { type, payload }) => {
  if (type === ACTIONS.RECEIVE_SIMULATIONS_FOR_SOURCE) {
    return payload;
  }
  return state;
};

const initialHikesState = [];
const hikes = (state = initialHikesState, { type, payload }) => {
  if (type === ACTIONS.RECEIVE_HIKES) {
    return payload;
  }
  return state;
};

const hikesLoading = (state = false, { type }) => {
  switch (type) {
    case ACTIONS.REQUEST_HIKES:
      return true;
    case ACTIONS.RECEIVE_HIKES:
    case ACTIONS.REQUEST_HIKES_FAILED:
      return false;
    default:
      return state;
  }
};

const initialFormState = {};
const form = (state = initialFormState, { type, payload }) => {
  switch(type) {
    case ACTIONS.SET_FORM:
      return payload || initialFormState;
    case ACTIONS.UPDATE_FORM:
      return {
        ...state,
        ...payload,
      };
    default:
      return state;
  }
};

const initialDetailFormState = {};
const detailForm = (state = initialDetailFormState, { type, payload }) => {
  switch(type) {
    case ACTIONS.SET_DETAIL_FORM:
      return payload || initialDetailFormState;
    case ACTIONS.UPDATE_DETAIL_FORM:
      return {
        ...state,
        ...payload,
      };
    default:
      return state;
  }
};

const actionEnabled = (state = false, { type, payload }) => {
  switch(type) {
    case ACTIONS.EDITOR_ACTION_ENABLED:
      return true;
    case ACTIONS.EDITOR_ACTION_DISABLED:
      return false;
    default:
      return state;
  }
};

const actionValid = (state = false, { type, payload }) => {
  switch(type) {
    case ACTIONS.EDITOR_ACTION_VALID:
      return true;
    case ACTIONS.EDITOR_ACTION_INVALID:
      return false;
    default:
      return state;
  }
};

const active = (state = '', { type, payload }) => {
  if (type === ACTIONS.SET_ACTIVE_SCOPE) {
    return payload;
  }
  return state;
};

const editorModuleReducer = combineReducers({
  simulationsLoading,
  simulations,
  hikesLoading,
  hikes,
  form,
  detailForm,
  actionEnabled,
  actionValid,
  active,
});

export type EditorModuleState = ReturnType<typeof editorModuleReducer>;
export type InsertableEditorModuleReducer = typeof editorModuleReducer
  & InsertableReducerType;

const insertableEditorModuleReducer: InsertableEditorModuleReducer = editorModuleReducer;

insertableEditorModuleReducer.reducer = 'editor';

export default insertableEditorModuleReducer;

export interface RootEditorState {
  editor: EditorModuleState;
}
