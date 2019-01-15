import { createAction } from 'redux-actions';
import { combineReducers } from 'redux';
import { createSelector } from 'reselect';

const uiSelector = ({ ui }) => ui;
export const titleSelector = createSelector(uiSelector, ({ title }) => title);
export const photoSelector = createSelector(uiSelector, ({ photo }) => photo);

export const ACTIONS = {
  SET_TITLE: 'SET_TITLE',
};

export const setTitle = createAction(ACTIONS.SET_TITLE);

const defaultEmpty = '';
const title = (state = defaultEmpty, { type, payload }) => {
  if (type === ACTIONS.SET_TITLE) {
    return `${payload.catalogName} - ${payload.sourceName}`;
  }
  return state;
};

const photo = (state = defaultEmpty, { type, payload }) => {
  if (type === ACTIONS.SET_TITLE) {
    return payload.sourceName || '';
  }
  return state;
};

export default combineReducers({
  title,
  photo,
});
