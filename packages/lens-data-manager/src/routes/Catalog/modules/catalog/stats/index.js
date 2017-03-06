import { makeStatsKey } from '@lens/image-descriptors';
import { ACTIONS } from '../constants';

import debugLib from 'debug';
const debug = debugLib('app:module:catalog-stats-reducers');

const statsLoadedReducer = (state = {}, data) => {
  // add the data to the stats object and reset the loading flag
  return {
    ...state,
    data,
    loading: false
  };
};

const statsLoadingReducer = (state = {}, loading) => {
  // set the loading flag
  return {
    ...state,
    loading
  };
};

const statsKeysReducer = (state = [], key) => {
  // add a key to the list of keys
  return [
    ...state,
    key
  ];
};

const statsByKeysReducer = (state = {}, key, stats) => {
  // add the stats
  return {
    ...state,
    [key]: stats
  };
};

const initialState = {
  keys: {},
  byKeys: {}
};

const requestStatsHandler = (state, { statsDescriptor, listKey }) => {
  const key = makeStatsKey(statsDescriptor);

  const existingKeys = state.keys[listKey] || [];
  const existingByKeys = state.byKeys[listKey] || {};
  const existingItem = existingByKeys[key];

  const keys = existingItem ? state.keys : {
    ...state.keys,
    [listKey]: statsKeysReducer(existingKeys, key)
  };
  const byKeys = {
    ...state.byKeys,
    [listKey]: statsByKeysReducer(existingByKeys, key, statsLoadingReducer(existingItem, true))
  };

  return {
    ...state,
    keys,
    byKeys
  };
};

const clearRequestStatsHandler = (state, { statsDescriptor, listKey }) => {
  const key = makeStatsKey(statsDescriptor);

  const existingByKeys = state.byKeys[listKey];
  const existingItem = existingByKeys[key];

  const byKeys = {
    ...state.byKeys,
    [listKey]: statsByKeysReducer(existingByKeys, key, statsLoadingReducer(existingItem, false))
  };

  return {
    ...state,
    byKeys
  };
};

const receiveStatsHandler = (state, { statsDescriptor, data, listKey }) => {
  const key = makeStatsKey(statsDescriptor);

  const existingByKeys = state.byKeys[listKey];
  const existingItem = existingByKeys[key];

  const byKeys = {
    ...state.byKeys,
    [listKey]: statsByKeysReducer(existingByKeys, key, statsLoadedReducer(existingItem, data))
  };

  return {
    ...state,
    byKeys
  };
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case ACTIONS.REQUEST_STATS:
      debug('REQUEST_STATS', { stamp: Date.now() });
      return requestStatsHandler(state, payload);
    case ACTIONS.CLEAR_REQUEST_STATS:
      debug('CLEAR_REQUEST_STATS');
      return clearRequestStatsHandler(state, payload);
    case ACTIONS.RECEIVE_STATS:
      debug('RECEIVE_STATS');
      return receiveStatsHandler(state, payload);

    default:
      return state;
  }
};

