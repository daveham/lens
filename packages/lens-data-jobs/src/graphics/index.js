import { createJob } from '../utils';

export const createImage = (id) => {
  return createJob('image', { id });
};
