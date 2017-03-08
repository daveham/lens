import { createSelector } from 'reselect';
import {
  makeImageKey,
  makeThumbnailImageDescriptor,
  makeSourceStatsDescriptor,
  makeSourceImageDescriptor
} from '@lens/image-descriptors';
import { IMAGE_LIST_KEYS } from 'routes/Catalog/constants';

export const sourcesSelector = ({ sources }) => {
  const { ids, byIds } = sources;
  return ids.map(id => byIds[id]);
};

export const thumbnailImageDescriptorsSelector = ({ sources }) => {
  const { ids, byIds } = sources;
  return ids.map(id => {
    const imageDescriptor = makeThumbnailImageDescriptor(id);
    imageDescriptor.input.file = byIds[id].file;
    return imageDescriptor;
  });
};

export const thumbnailImageKeysSelector = createSelector(
  thumbnailImageDescriptorsSelector,
  descriptors => descriptors.map(makeImageKey)
);

const THUMBNAIL_IMAGE_LOADING_URL = '/thumbloading.png';
const thumbnailUrlFromImage = image => {
  return (image && !image.loading) ? image.url : THUMBNAIL_IMAGE_LOADING_URL;
};

export const thumbnailUrlFromKeySelector = (state, key) => {
  const thumbnailByKeys = state.images.byKeys[IMAGE_LIST_KEYS.THUMBNAILS] || {};
  const image = thumbnailByKeys[key];
  return thumbnailUrlFromImage(image);
};

export const thumbnailUrlFromIdSelector = (state, id) => {
  const imageDescriptor = makeThumbnailImageDescriptor(id);
  const key = makeImageKey(imageDescriptor);
  return thumbnailUrlFromKeySelector(state, key);
};

export const thumbnailUrlsSelector = state => {
  const { keys, byKeys } = state.images;
  const thumbnailkeys = keys[IMAGE_LIST_KEYS.THUMBNAILS] || [];
  const thumbnailByKeys = byKeys[IMAGE_LIST_KEYS.THUMBNAILS] || {};
  return thumbnailkeys.map(key => thumbnailUrlFromImage(thumbnailByKeys[key]));
};

export const sourceStatsDescriptorSelector = (state, id) => {
  const imageDescriptor = makeSourceImageDescriptor(id);
  const source = state.sources.byIds[id];

  if (source) {
    imageDescriptor.input.file = source.file;
  }
  return makeSourceStatsDescriptor(imageDescriptor);
};
