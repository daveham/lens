import { makeStatsKey } from '@lens/image-descriptors';
import {
  itemLoadedReducer,
  itemLoadingReducer,
  addOrUpdateItem
} from '../utils';
import { ACTIONS } from './actions';

const statsLoadingHandler = (state, { listKey, statsDescriptor, data }) => {
  const key = makeStatsKey(statsDescriptor);
  const statsReducerFn = (item) => itemLoadingReducer(item, data, true);
  return addOrUpdateItem(state, listKey, key, statsReducerFn);
};

const statsNotLoadingHandler = (state, { listKey, statsDescriptor, data }) => {
  const key = makeStatsKey(statsDescriptor);
  const statsReducerFn = (item) => itemLoadingReducer(item, data, false);
  return addOrUpdateItem(state, listKey, key, statsReducerFn);
};

const statsLoadedHandler = (state, { listKey, statsDescriptor, data }) => {
  const key = makeStatsKey(statsDescriptor);
  const statsReducerFn = (item) => itemLoadedReducer(item, { data });
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
