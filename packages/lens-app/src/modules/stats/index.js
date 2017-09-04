//import { combineReducers } from 'redux';
import { createAction } from 'redux-actions';
import { makeStatsKey } from '@lens/image-descriptors';
import {
  itemLoadedReducer,
  itemLoadingReducer,
  addOrUpdateItem
} from '../utils';

export const ACTIONS = {
  REQUEST_STATS: 'REQUEST_STATS',
  CLEAR_REQUEST_STATS: 'CLEAR_REQUEST_STATS',
  RECEIVE_STATS: 'RECEIVE_STATS'
};

export const requestStatsAction = createAction(ACTIONS.REQUEST_STATS/*, actionPayloadFromStatsDescriptor */);
export const clearRequestStatsAction = createAction(ACTIONS.CLEAR_REQUEST_STATS/*, actionPayloadFromStatsDescriptor */);
export const receiveStatsAction = createAction(ACTIONS.RECEIVE_STATS/*, actionPayloadFromStatsDescriptor */);


const requestStatsHandler = (state, { listKey, statsDescriptor }) => {
  const key = makeStatsKey(statsDescriptor);
  const statsReducerFn = (item) => itemLoadingReducer(item, true);
  return addOrUpdateItem(state, listKey, key, statsReducerFn);
};

const clearRequestStatsHandler = (state, { listKey, statsDescriptor }) => {
  const key = makeStatsKey(statsDescriptor);
  const statsReducerFn = (item) => itemLoadingReducer(item, false);
  return addOrUpdateItem(state, listKey, key, statsReducerFn);
};

const receiveStatsHandler = (state, { listKey, statsDescriptor, url }) => {
  const key = makeStatsKey(statsDescriptor);
  const statsReducerFn = (item) => itemLoadedReducer(item, url);
  return addOrUpdateItem(state, listKey, key, statsReducerFn);
};

const initialState = {
  keys: {},
  byKeys: {}
};

const statsActionHandlers = {};
const defaultHandler = (state) => state;
statsActionHandlers[ACTIONS.REQUEST_STATS] = requestStatsHandler;
statsActionHandlers[ACTIONS.CLEAR_REQUEST_STATS] = clearRequestStatsHandler;
statsActionHandlers[ACTIONS.RECEIVE_STATS] = receiveStatsHandler;
const getActionHandler = (type) => statsActionHandlers[type] || defaultHandler;

const statsReducer = (state = initialState, action) => {
  if (action) {
    const { type, payload } = action;
    return getActionHandler(type)(state, payload);
  }
  return state;
};

export default statsReducer;
