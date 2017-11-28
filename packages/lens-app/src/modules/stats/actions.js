import { createAction } from 'redux-actions';
import { listKeyFromStatsDescriptor } from './selectors';

export const ACTIONS = {
  STATS_ENSURE: 'STATS_ENSURE',
  STATS_LOADING: 'STATS_LOADING',
  STATS_NOT_LOADING: 'STATS_NOT_LOADING',
  STATS_LOADED: 'STATS_LOADED'
};

const actionPayloadFromStatsDescriptor = (payload) => {
  return {
    ...payload,
    listKey: listKeyFromStatsDescriptor(payload.statsDescriptor)
  };
};

export const ensureStats = createAction(ACTIONS.STATS_ENSURE, actionPayloadFromStatsDescriptor);
export const statsLoading = createAction(ACTIONS.STATS_LOADING, actionPayloadFromStatsDescriptor);
export const statsNotLoading = createAction(ACTIONS.STATS_NOT_LOADING, actionPayloadFromStatsDescriptor);
export const statsLoaded = createAction(ACTIONS.STATS_LOADED, actionPayloadFromStatsDescriptor);

