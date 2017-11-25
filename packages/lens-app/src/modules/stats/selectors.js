import { makeStatsKey } from '@lens/image-descriptors';
import { listKeyFromStatsDescriptor } from './actions';

export const STATS_LIST_KEYS = {
  DEFAULT: 'stats',
  SOURCES: 'sources'
};

export const statsSelector = (state, statsDescriptor) => {
  const listKey = listKeyFromStatsDescriptor(statsDescriptor);
  const byKeys = state.stats.byKeys[listKey] || {};
  const key = makeStatsKey(statsDescriptor);
  return byKeys[key];
};
