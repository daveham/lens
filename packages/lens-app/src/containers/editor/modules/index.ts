import { combineReducers } from 'redux';
import { InsertableReducerType } from 'modules/types';

export interface EditorPlaceHolderState {
  placeHolder: number;
}

// constants
export const EDITOR_MODULE_PLACEHOLDER = 'EDITOR_MODULE_PLACEHOLDER';

// action types
interface EditorModulePlaceHolderAction {
  type: typeof EDITOR_MODULE_PLACEHOLDER;
  payload: number;
}

export type EditorModuleActionTypes = EditorModulePlaceHolderAction;

// action creators
export function assignPlaceholder(value: number): EditorModuleActionTypes {
  return {
    type: EDITOR_MODULE_PLACEHOLDER,
    payload: value,
  };
}

// reducers
const initialState: EditorPlaceHolderState = {
  placeHolder: 0,
};

export function placeHolder(
  state = initialState,
  action: EditorModuleActionTypes
): EditorPlaceHolderState {
  if (action.type === EDITOR_MODULE_PLACEHOLDER) {
    return {
      ...state,
      placeHolder: action.payload,
    };
  }
  return state;
}

const editorModuleReducer = combineReducers({
  placeHolder,
});

export type EditorModuleState = ReturnType<typeof editorModuleReducer>;
export type InsertableEditorModuleReducer = typeof editorModuleReducer
  & InsertableReducerType;

const insertableEditorModuleReducer: InsertableEditorModuleReducer = editorModuleReducer;

insertableEditorModuleReducer.reducer = 'editor';

export default insertableEditorModuleReducer;
