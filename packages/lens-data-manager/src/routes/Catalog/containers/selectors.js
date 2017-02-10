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

export const sourceImageIdsSelector = createSelector(
  state => state.catalog.sources,
  sources => sources.map(source => source.id)
);

export const thumbnailImageDescriptorsSelector = createSelector(
  sourceImageIdsSelector,
  imageIds => imageIds.map(makeThumbImageDescriptor)
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

export const thumbnailImageUrlsSelector = createSelector(
  thumbnailImagesSelector,
  images => images.map((image) => {
    if (image) {
      if (image.loading) {
        return '/thumbloading.png';
      } else {
        return image.url;
      }
    } else {
      return '/thumbloading.png';
    }
  })
);
