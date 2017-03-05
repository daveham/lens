import { createSelector } from 'reselect';
import { makeThumbnailImageDescriptor, makeImageKey } from '@lens/image-descriptors';

export const sourcesSelector = ({ sources }) => {
  const { ids, byIds } = sources;
  return ids.map(id => byIds[id]);
};

export const thumbnailImageDescriptorsSelector = ({ sources }) => {
  const { ids, byIds } = sources;
  return ids.map(id => {
    const desc = makeThumbnailImageDescriptor(id);
    desc.input.file = byIds[id].file;
    return desc;
  });
};

export const thumbnailImageIdsSelector = createSelector(
  thumbnailImageDescriptorsSelector,
  descriptors => descriptors.map(makeImageKey)
);

const THUMBNAIL_IMAGE_LOADING_URL = '/thumbloading.png';
const THUMBNAILS_LIST_KEY = 'thumbnails';

export const thumbnailImageUrlsSelector = ({ images }) => {
  const { ids, byIds } = images;
  const thumbnailIds = ids[THUMBNAILS_LIST_KEY] || [];
  const thumbnailByIds = byIds[THUMBNAILS_LIST_KEY] || {};
  return thumbnailIds.map(id => {
    const image = thumbnailByIds[id];
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
