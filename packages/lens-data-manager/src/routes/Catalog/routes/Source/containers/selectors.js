import { makeSourceStatsDescriptor, makeSourceImageDescriptor } from '@lens/image-descriptors';

export const sourceStatsDescriptorsSelector = ({ sources }, id) => {
  const desc = makeSourceImageDescriptor(id);
  const { byIds } = sources;
  desc.input.file = byIds[id].file;
  return makeSourceStatsDescriptor(desc);
};
