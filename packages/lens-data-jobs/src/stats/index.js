import { createJob } from '../utils';

export const createStats = (statsDescriptor) => {
  return createJob('stats', { statsDescriptor });
};
