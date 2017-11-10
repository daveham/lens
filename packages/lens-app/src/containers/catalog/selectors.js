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

