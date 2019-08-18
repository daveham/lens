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

const editorModuleReducer = combineReducers({
  loading,
  simulations,
});

export type EditorModuleState = ReturnType<typeof editorModuleReducer>;
export type InsertableEditorModuleReducer = typeof editorModuleReducer
  & InsertableReducerType;

const insertableEditorModuleReducer: InsertableEditorModuleReducer = editorModuleReducer;

insertableEditorModuleReducer.reducer = 'editor';

export default insertableEditorModuleReducer;
