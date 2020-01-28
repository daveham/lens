import { makeStatsKey } from '@lens/image-descriptors';

export const STATS_LIST_KEYS = {
  DEFAULT: 'stats',
  SOURCES: 'sources',
};

export const sourcesListKey = () => STATS_LIST_KEYS.SOURCES;
export const statsListKey = (id, group) => `${STATS_LIST_KEYS.DEFAULT}/${id}/${group}`;

export const listKeyFromStatsDescriptor = ({ imageDescriptor }) => {
  if (imageDescriptor.input.group) {
    const { id, group } = imageDescriptor.input;
    return statsListKey(id, group);
  }
  return sourcesListKey();
};

const emptyObject = {};
export const statsSelector = (state, statsDescriptor) => {
  const listKey = listKeyFromStatsDescriptor(statsDescriptor);
  const byKeys = state.stats.byKeys[listKey] || emptyObject;
  const key = makeStatsKey(statsDescriptor);
  return byKeys[key];
};

export const tileStatsSelector = ({ stats }, id, group) => {
  return stats.byKeys[statsListKey(id, group)] || emptyObject;
};

export const statsByKeySelector = ({ stats }, key) => {
  const byKeys = stats.byKeys[STATS_LIST_KEYS.SOURCES] || emptyObject;
  const statsItem = byKeys[key];
  if (statsItem) {
    return statsItem.data;
  }
};
