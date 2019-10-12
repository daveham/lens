import { createActions } from 'redux-actions';
import { listKeyFromStatsDescriptor } from './selectors';

const actionPayloadFromStatsDescriptor = (payload) => {
  return {
    ...payload,
    listKey: listKeyFromStatsDescriptor(payload.statsDescriptor)
  };
};

export const {
  ensureStats,
  statsLoading,
  statsNotLoading,
  statsLoaded,
  deleteStats,
  statsDeleted,
  statsDeleteFailed,
} = createActions({
  ENSURE_STATS: actionPayloadFromStatsDescriptor,
  STATS_LOADING: actionPayloadFromStatsDescriptor,
  STATS_NOT_LOADING: actionPayloadFromStatsDescriptor,
  STATS_LOADED: actionPayloadFromStatsDescriptor,
},
  'DELETE_STATS',
  'STATS_DELETED',
  'STATS_DELETE_FAILED',
);
