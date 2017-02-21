import { createSelector } from 'reselect';
import { makeThumbnailImageDescriptor, makeImageId } from '@lens/image-descriptors';

export const sourcesByIdSelector = createSelector(
  state => state.catalog.sources,
  sources => {
    const byId = {};
    sources.forEach((source) => { byId[source.id] = source; });
    return byId;
  }
);

export const thumbnailImageDescriptorsSelector = createSelector(
  state => state.catalog.sources,
  sources => sources.map(({ id, file}) => {
    const desc = makeThumbnailImageDescriptor(id);
    desc.input.file = file;
    return desc;
  })
);

export const thumbnailImageIdsSelector = createSelector(
  thumbnailImageDescriptorsSelector,
  descriptors => descriptors.map(makeImageId)
);

export const imagesSelector = state => state.images;

export const thumbnailImagesSelector = createSelector(
  [thumbnailImageIdsSelector, imagesSelector],
  (ids, images) => ids.map(id => images[id])
);

const THUMBNAIL_IMAGE_LOADING_URL = '/thumbloading.png';
export const thumbnailImageUrlsSelector = createSelector(
  thumbnailImagesSelector,
  images => images.map((image) => {
    if (image) {
      if (image.loading) {
        return THUMBNAIL_IMAGE_LOADING_URL;
      } else {
        return image.url;
      }
    } else {
      return THUMBNAIL_IMAGE_LOADING_URL;
    }
  })
);
