import { createSelector } from 'reselect';
import { makeThumbnailImageDescriptor, makeImageKey } from '@lens/image-descriptors';

export const catalogIsLoading = ({ catalog }) => catalog.loading;
export const catalogIsLoaded = ({ catalog }) => Boolean(catalog.name);
export const catalogName = ({ catalog }) => catalog.name;
export const catalogSources = ({ catalog }) => catalog.sources;

export const sources = createSelector(
  catalogSources,
  catalogSources => {
    if (catalogSources) {
      const { ids, byIds } = catalogSources;
      return ids.map(id => byIds[id]);
    }
    return [];
  }
);

export const thumbnailImageDescriptors = createSelector(
  catalogSources,
  catalogSources => {
    if (catalogSources) {
      const { ids } = catalogSources;
      return ids.map(id => makeThumbnailImageDescriptor(id));
    }
    return [];
  }
);

export const thumbnailImageKeys = createSelector(
  thumbnailImageDescriptors,
  imageDescriptors => imageDescriptors.map(imageDescriptor => makeImageKey(imageDescriptor))
);
