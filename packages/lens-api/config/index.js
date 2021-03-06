import Redis from 'ioredis';
import getDebugLog from './debugLog';
const debug = getDebugLog();

const usingVagrant = process.env.USER === 'vagrant';

const serverHost = process.env.REST_SERVER || usingVagrant ? '192.168.20.20' : '0.0.0.0';

const serverPort = process.env.REST_PORT || process.env.PORT || 3001;

const keyPrefix = 'lens:';

const redisOptions = {
  keyPrefix,
  port: 6379,
  host: '127.0.0.1',
  family: 4,
  password: null,
  db: 0,
};
let redis = null;
const getRedisClient = () => {
  if (!redis) {
    debug('getRedisClient - creating redis connection');
    redis = new Redis(redisOptions);
  }
  return redis;
};

const resqueOptions = {
  port: 6379,
  host: '127.0.0.1',
  family: 4,
  password: null,
  db: 0,
};
let resque = null;
const getResqueClient = () => {
  if (!resque) {
    debug('getResqueClient - creating resque connection');
    resque = new Redis(resqueOptions);
  }
  return resque;
};

const config = {
  env: process.env.NODE_ENV,
  serverHost,
  serverPort,
  getRedisClient,
  keyPrefix,
  queueConnection: { redis: getResqueClient() },

  queueName: 'il',
};

export default config;
