import { createJob } from '../utils';

export const createPing = (clientId) => {
  return createJob('ping', { clientId });
};
