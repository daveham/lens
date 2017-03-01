import { createSelector } from 'reselect';
import { makeThumbnailImageDescriptor, makeImageId } from '@lens/image-descriptors';

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
  descriptors => descriptors.map(makeImageId)
);

const THUMBNAIL_IMAGE_LOADING_URL = '/thumbloading.png';

export const thumbnailImageUrlsSelector = ({ images }) => {
  const { ids, byIds } = images;
  const thumbnailIds = ids['thumbnails'] || [];
  const thumbnailByIds = byIds['thumbnails'] || {};
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
