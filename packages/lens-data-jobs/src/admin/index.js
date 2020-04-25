import { createJob } from '../utils';

export const createPing = clientId => {
  return createJob('ping', { clientId });
};

export const deleteStats = (clientId, sourceId, group) => {
  return createJob('deleteStats', { clientId, sourceId, group });
};
