import { createJob } from '../utils';

export const createImage = (imageDescriptor) => {
  return createJob('image', { imageDescriptor });
};
