import { makeSourceStatsDescriptor, makeSourceImageDescriptor } from '@lens/image-descriptors';

export const sourceStatsDescriptorSelector = (state, id) => {
  const { sources } = state;
  const desc = makeSourceImageDescriptor(id);
  const image = sources.byIds[id];
  if (image) {
    desc.input.file = image.file;
  }
  return makeSourceStatsDescriptor(desc);
};
