import { createJob } from '../utils';

export const createStats = (clientId, statsDescriptor, sourceFilename) => {
  return createJob('stats', { clientId, statsDescriptor, sourceFilename });
};
