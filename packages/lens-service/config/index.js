import Redis from 'ioredis';
import _debug from 'debug';
const debug = _debug('lens:service:config');

const usingVagrant = process.env.USER === 'vagrant';

const serverHost = process.env.SERVICE_SERVER || usingVagrant ? '192.168.20.20' : '0.0.0.0';

const serverPort = process.env.SERVICE_PORT || process.env.PORT || 3002;

const keyPrefix = 'lens:';

const redisOptions = {
  keyPrefix,
  port: 6379,
  host: '127.0.0.1',
  family: 4,
  password: null,
  db: 0,
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
  redisOptions,
  resqueOptions,
  keyPrefix,
  queueConnection: { redis: getResqueClient() },
  queueName: 'il',
};

export default config;
