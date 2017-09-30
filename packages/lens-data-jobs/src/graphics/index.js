import { createJob } from '../utils';

export const createImage = (clientId, imageDescriptor) => {
  return createJob('image', { clientId, imageDescriptor });
};
