import { createJob } from '../utils';

export const createImage = (clientId, imageDescriptor, sourceFilename) => {
  return createJob('image', { clientId, imageDescriptor, sourceFilename });
};
