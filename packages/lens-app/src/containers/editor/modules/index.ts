import { combineReducers } from 'redux';
import { InsertableReducer } from 'modules/types';

const placeHolder = (state = 0, { type, payload }) => {
  if (type === 'PLACEHOLDER') {
    return payload;
  }
  return state;
};

const editorReducer: InsertableReducer = combineReducers({
  placeHolder,
});

editorReducer.reducer = 'editor';

export default editorReducer;
