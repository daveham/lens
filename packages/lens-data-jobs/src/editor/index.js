import { createJob } from '../utils';

export const runExecution = (clientId, payload) => {
  return createJob('runExecution', { clientId, payload });
};
