import { createJob } from '../utils';

export const createStats = (sd) => {
  return createJob('stats', { sd });
};
