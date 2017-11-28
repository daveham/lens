import {
  makeStatsKey,
  makeSourceImageDescriptor,
  makeSourceStatsDescriptor
} from '@lens/image-descriptors';

export const STATS_LIST_KEYS = {
  DEFAULT: 'stats',
  SOURCES: 'sources'
};

export const listKeyFromStatsDescriptor = statsDescriptor => {
  let listKey = STATS_LIST_KEYS.DEFAULT;
  if (statsDescriptor) {
    const { imageDescriptor } = statsDescriptor;
    if (imageDescriptor) {
      if (!imageDescriptor.output) {
        listKey = STATS_LIST_KEYS.SOURCES;
      }
    }
  }
  return listKey;
};

export const statsSelector = (state, statsDescriptor) => {
  const listKey = listKeyFromStatsDescriptor(statsDescriptor);
  const byKeys = state.stats.byKeys[listKey] || {};
  const key = makeStatsKey(statsDescriptor);
  const statsItem = byKeys[key];
  if (statsItem) {
    return statsItem.data;
  }
};

export const sourceStatsDescriptorSelector = (state, id) => {
  const imageDescriptor = makeSourceImageDescriptor(id);
  const source = state.catalog.sources.byIds[id];

  if (source) {
    imageDescriptor.input.file = source.file;
  }
  return makeSourceStatsDescriptor(imageDescriptor);
};

export const statsByKeySelector = ({ stats }, key) => {
  const byKeys = stats.byKeys[STATS_LIST_KEYS.SOURCES] || {};
  const statsItem = byKeys[key];
  if (statsItem) {
    return statsItem.data;
  }
};
