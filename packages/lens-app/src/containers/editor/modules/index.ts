import { combineReducers } from 'redux';
import { ACTIONS } from './constants';
import { InsertableReducerType } from 'modules/types';

// reducers
const loading = (state = false, { type }) => {
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

const initialSimulationState = [];
const simulations = (state = initialSimulationState, { type, payload }) => {
  if (type === ACTIONS.RECEIVE_SIMULATIONS_FOR_SOURCE) {
    return payload;
  }
  return state;
};

const simulation = (state = null, { type, payload }) => {
  switch(type) {
    case ACTIONS.SET_SIMULATION:
      return payload;
    case ACTIONS.UPDATE_SIMULATION:
      const safeState = state || {};
      return {
        ...safeState,
        ...payload,
      };
    default:
      return state;
  }
};

const execution = (state = null, { type, payload }) => {
  switch(type) {
    case ACTIONS.SET_EXECUTION:
      return payload;
    case ACTIONS.UPDATE_EXECUTION:
      const safeState = state || {};
      return {
        ...safeState,
        ...payload,
      };
    default:
      return state;
  }
};

const rendering = (state = null, { type, payload }) => {
  switch(type) {
    case ACTIONS.SET_RENDERING:
      return payload;
    case ACTIONS.UPDATE_RENDERING:
      const safeState = state || {};
      return {
        ...safeState,
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
  loading,
  simulations,
  simulation,
  execution,
  rendering,
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
