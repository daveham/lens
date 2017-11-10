import { createAction } from 'redux-actions';

export const ACTIONS = {
  STATS_LOADING: 'STATS_LOADING',
  STATS_NOT_LOADING: 'STATS_NOT_LOADING',
  STATS_LOADED: 'STATS_LOADED'
};

export const statsLoading = createAction(ACTIONS.STATS_LOADING/*, actionPayloadFromStatsDescriptor */);
export const statsNotLoading = createAction(ACTIONS.STATS_NOT_LOADING/*, actionPayloadFromStatsDescriptor */);
export const statsLoaded = createAction(ACTIONS.STATS_LOADED/*, actionPayloadFromStatsDescriptor */);

