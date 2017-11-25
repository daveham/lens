import { createJob } from '../utils';

export const createStats = (clientId, statsDescriptor) => {
  return createJob('stats', { clientId, statsDescriptor });
};
