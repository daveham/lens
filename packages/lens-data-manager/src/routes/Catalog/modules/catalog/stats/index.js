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

const initialState = {
  ids: {},
  byIds: {}
};

const statsIdsReducer = (state = [], id) => {
  debug('statsIdsReducer', { id, state });
  // add an id to the list of ids
  return [
    ...state,
    id
  ];
};

const statsByIdsReducer = (state = {}, id, stats) => {
  debug('statsByIdsReducer', { id, stats, state });
  // add the stats
  return {
    ...state,
    [id]: stats
  };
};

const requestStatsHandler = (state, { statsDescriptor, listKey }) => {
  const id = makeStatsKey(statsDescriptor);

  const existingIds = state.ids[listKey] || [];
  const existingByIds = state.byIds[listKey] || {};
  const existingItem = existingByIds[id];

  const ids = existingItem ? state.ids : {
    ...state.ids,
    [listKey]: statsIdsReducer(existingIds, id)
  };
  const byIds = {
    ...state.byIds,
    [listKey]: statsByIdsReducer(existingByIds, id, statsLoadingReducer(existingItem, true))
  };

  return {
    ...state,
    ids,
    byIds
  };
};

const clearRequestStatsHandler = (state, { statsDescriptor, listKey }) => {
  const id = makeStatsKey(statsDescriptor);

  const existingByIds = state.byIds[listKey];
  const existingItem = existingByIds[id];

  const byIds = {
    ...state.byIds,
    [listKey]: statsByIdsReducer(existingByIds, id, statsLoadingReducer(existingItem, false))
  };

  return {
    ...state,
    byIds
  };
};

const receiveStatsHandler = (state, { statsDescriptor, data, listKey }) => {
  const id = makeStatsKey(statsDescriptor);

  const existingByIds = state.byIds[listKey];
  const existingItem = existingByIds[id];

  const byIds = {
    ...state.byIds,
    [listKey]: statsByIdsReducer(existingByIds, id, statsLoadedReducer(existingItem, data))
  };

  return {
    ...state,
    byIds
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

