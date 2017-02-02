import { createJob } from '../utils';

export const createThumbnail = (id) => {
  return createJob('thumbnail', { id });
};
