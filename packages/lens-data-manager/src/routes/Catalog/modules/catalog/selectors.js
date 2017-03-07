import { createSelector } from 'reselect';
import { makeThumbnailImageDescriptor, makeImageKey } from '@lens/image-descriptors';

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
const THUMBNAILS_LIST_KEY = 'thumbnails';

export const thumbnailImageUrlsSelector = ({ images }) => {
  const { keys, byKeys } = images;
  const thumbnailkeys = keys[THUMBNAILS_LIST_KEY] || [];
  const thumbnailByKeys = byKeys[THUMBNAILS_LIST_KEY] || {};
  return thumbnailkeys.map(key => {
    const image = thumbnailByKeys[key];
    if (image) {
      if (image.loading) {
        return THUMBNAIL_IMAGE_LOADING_URL;
      } else {
        return image.url;
      }
    } else {
      return THUMBNAIL_IMAGE_LOADING_URL;
    }
  });
};
