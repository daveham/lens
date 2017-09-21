import { createAction } from 'redux-actions';
import { makeStatsKey } from '@lens/image-descriptors';
import {
  itemLoadedReducer,
  itemLoadingReducer,
  addOrUpdateItem
} from '../utils';

export const ACTIONS = {
  STATS_LOADING: 'STATS_LOADING',
  STATS_NOT_LOADING: 'STATS_NOT_LOADING',
  STATS_LOADED: 'STATS_LOADED'
};

export const statsLoading = createAction(ACTIONS.STATS_LOADING/*, actionPayloadFromStatsDescriptor */);
export const statsNotLoading = createAction(ACTIONS.STATS_NOT_LOADING/*, actionPayloadFromStatsDescriptor */);
export const statsLoaded = createAction(ACTIONS.STATS_LOADED/*, actionPayloadFromStatsDescriptor */);


const statsLoadingHandler = (state, { listKey, statsDescriptor }) => {
  const key = makeStatsKey(statsDescriptor);
  const statsReducerFn = (item) => itemLoadingReducer(item, true);
  return addOrUpdateItem(state, listKey, key, statsReducerFn);
};

const statsNotLoadingHandler = (state, { listKey, statsDescriptor }) => {
  const key = makeStatsKey(statsDescriptor);
  const statsReducerFn = (item) => itemLoadingReducer(item, false);
  return addOrUpdateItem(state, listKey, key, statsReducerFn);
};

const statsLoadedHandler = (state, { listKey, statsDescriptor, url }) => {
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
statsActionHandlers[ACTIONS.STATS_LOADING] = statsLoadingHandler;
statsActionHandlers[ACTIONS.STATS_NOT_LOADING] = statsNotLoadingHandler;
statsActionHandlers[ACTIONS.STATS_LOADED] = statsLoadedHandler;
const getActionHandler = (type) => statsActionHandlers[type] || defaultHandler;

const statsReducer = (state = initialState, action) => {
  if (action) {
    const { type, payload } = action;
    return getActionHandler(type)(state, payload);
  }
  return state;
};

export default statsReducer;
