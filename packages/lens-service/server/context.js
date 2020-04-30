import Redis from 'ioredis';
import config from '../config';
import connections from './connections';

import getDebugLog from './debugLog';
const debug = getDebugLog('context');

let redis = null;
export const getRedisClient = () => {
  if (!redis) {
    debug('getRedisClient - creating redis connection');
    redis = new Redis(config.redisOptions);
  }
  return redis;
};

let resque = null;
export const getResqueClient = () => {
  if (!resque) {
    debug('getResqueClient - creating resque connection');
    resque = new Redis(config.resqueOptions);
  }
  return resque;
};

// A socket job response includes the meta-data from the submission, plus extra
// meta-data about job performance, plus the results of the job. The payload
// from the job submission is excluded.
export const respond = ({ payload, ...metadata }, result) => {
  const { clientId, started } = metadata;
  const socket = connections.getConnectionByClientId(clientId);
  if (socket) {
    const finished = Date.now();
    const duration = finished - started;
    const response = {
      ...metadata,
      finished,
      duration,
      result,
    };
    debug(
      `job ${metadata.jobId} ${metadata.command}, waited ${metadata.waited}, duration ${duration}`,
    );
    socket.emit('job', response);
  } else {
    debug(`no socket available for response for client ${clientId}`);
  }
};

// A socket job error response follows the same rules as a non-error response but the
// "result" is an object containing the error.
export const respondWithError = (job, error) => {
  debug('respondWithError', { error });
  respond(job, { error });
};
