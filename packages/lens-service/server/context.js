import Redis from 'ioredis';
import config from '../config';
import connections from './connections';

import _debug from 'debug';
const debug = _debug('lens:service-context');

let redis = null;
const getRedisClient = () => {
  if (!redis) {
    debug('getRedisClient - creating redis connection');
    redis = new Redis(config.redisOptions);
  }
  return redis;
};

let resque = null;
const getResqueClient = () => {
  if (!resque) {
    debug('getResqueClient - creating resque connection');
    resque = new Redis(config.resqueOptions);
  }
  return resque;
};

const respond = result => {
  const { clientId, started, waited, message } = result;
  const socket = connections.getConnectionByClientId(clientId);
  if (socket) {
    const finished = Date.now();
    const duration = finished - started;
    const response = {
      ...result,
      finished,
      duration,
      message,
    };
    debug(`job ${response.jobId} ${response.command}, waited ${waited}, duration ${duration}, ${message}`);
    socket.emit('job', response);
  } else {
    debug(`no socket available for response for client ${clientId}`);
  }
};

const respondWithError = (error, job) => {
  debug('respondWithError', { error });
  respond({
    ...job,
    error,
  });
};

const context = {
  connections,
  getRedisClient,
  respond,
  respondWithError,
  queueConnection: { redis: getResqueClient() },
};

export default context;
