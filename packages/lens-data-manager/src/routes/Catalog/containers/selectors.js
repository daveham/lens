import { createSelector } from 'reselect';
import { makeThumbImageDescriptor, makeImageId } from '@lens/image-descriptors';

export const sourcesByIdSelector = createSelector(
  state => state.catalog.sources,
  sources => {
    const byId = {};
    if (sources) {
      sources.forEach((source) => { byId[source.id] = source; });
    }
    return byId;
  }
);

export const sourceIdAndFileSelector = createSelector(
  state => state.catalog.sources,
  sources => sources.map(({ id, file }) => { return { id, file }; })
);

export const thumbnailImageDescriptorsSelector = createSelector(
  sourceIdAndFileSelector,
  imageIds => imageIds.map(({ id, file}) => makeThumbImageDescriptor(id, file))
);

export const thumbnailImageIdsSelector = createSelector(
  thumbnailImageDescriptorsSelector,
  descriptors => descriptors.map(makeImageId)
);

export const imagesSelector = state => state.images;

export const thumbnailImagesSelector = createSelector(
  [imagesSelector, thumbnailImageIdsSelector],
  (images, ids) => ids.map(id => images[id])
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
