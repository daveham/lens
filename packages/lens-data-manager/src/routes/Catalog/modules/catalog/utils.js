import { IMAGE_LIST_KEYS, STATS_LIST_KEYS } from 'routes/Catalog/constants';

export const listKeyFromImageDescriptor = imageDescriptor => {
  let listKey = IMAGE_LIST_KEYS.DEFAULT;
  if (imageDescriptor && imageDescriptor.output && imageDescriptor.output.purpose === 't') {
    listKey = IMAGE_LIST_KEYS.THUMBNAILS;
  }
  return listKey;
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
