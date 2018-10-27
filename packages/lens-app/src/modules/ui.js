import { createAction } from 'redux-actions';
import { combineReducers } from 'redux';

export const ACTIONS = {
  SET_TITLE: 'SET_TITLE',
};

export const setTitle = createAction(ACTIONS.SET_TITLE);

const defaultTitle = '';
const title = (state = defaultTitle, { type, payload }) => {
  if (type === ACTIONS.SET_TITLE) {
    return payload;
  }
  return state;
};

export default combineReducers({
  title,
});
