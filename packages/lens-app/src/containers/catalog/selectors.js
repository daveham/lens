import { createSelector } from 'reselect';
import { makeThumbnailImageDescriptor } from '@lens/image-descriptors';

export const loading = ({ catalog }) => catalog.loading;
export const loaded = ({ catalog }) => Boolean(catalog.name);
export const name = ({ catalog }) => catalog.name;
export const sources = ({ catalog }) => catalog.sources;
export const sourcesArray = createSelector(sources, sources => {
  if (sources) {
    const { ids, byIds } = sources;
    return ids.map(id => byIds[id]);
  }
});
export const thumbnailImageDescriptorsArray = createSelector(sources, sources => {
  if (sources) {
    const { ids, byIds } = sources;
    return ids.map(id => {
      const imageDescriptor = makeThumbnailImageDescriptor(id);
      imageDescriptor.input.file = byIds[id].file;
      return imageDescriptor;
    });
  }
});

export const IMAGE_LIST_KEYS = {
  DEFAULT: 'images',
  THUMBNAILS: 'thumbnails'
};

export const STATS_LIST_KEYS = {
  DEFAULT: 'stats',
  SOURCES: 'sources'
};

const thumbnailUrlFromImage = image => {
  return (image && !image.loading) ? image.url : null;
};

export const thumbnailUrlsSelector = state => {
  const { keys, byKeys } = state.images;
  const thumbnailKeys = keys[IMAGE_LIST_KEYS.THUMBNAILS] || [];
  const thumbnailByKeys = byKeys[IMAGE_LIST_KEYS.THUMBNAILS] || {};
  return thumbnailKeys.map(key => thumbnailUrlFromImage(thumbnailByKeys[key]));
};
