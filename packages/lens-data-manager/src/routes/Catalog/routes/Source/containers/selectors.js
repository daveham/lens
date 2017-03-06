import { makeSourceStatsDescriptor, makeSourceImageDescriptor } from '@lens/image-descriptors';

export const sourceStatsDescriptorSelector = (state, id) => {
  const imageDescriptor = makeSourceImageDescriptor(id);
  const source = state.sources.byIds[id];

  if (source) {
    imageDescriptor.input.file = source.file;
  }
  return makeSourceStatsDescriptor(imageDescriptor);
};
