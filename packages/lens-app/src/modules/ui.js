import { createActions, handleActions } from 'redux-actions';
import { combineReducers } from 'redux';
import { createSelector } from 'reselect';

const uiSelector = ({ ui }) => ui;
export const titleSelector = createSelector(
  uiSelector,
  ({ title }) => title,
);
export const photoSelector = createSelector(
  uiSelector,
  ({ photo }) => photo,
);

export const { setTitle } = createActions('SET_TITLE', { prefix: 'UI' });

const defaultEmpty = '';
const title = handleActions(
  {
    [setTitle]: (state, { payload }) =>
      payload.sourceName ? `${payload.catalogName} - ${payload.sourceName}` : payload.catalogName,
  },
  defaultEmpty,
);

const photo = handleActions(
  {
    [setTitle]: (state, { payload }) => payload.sourceName || defaultEmpty,
  },
  defaultEmpty,
);

export default combineReducers({
  title,
  photo,
});
