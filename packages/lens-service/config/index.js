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

const config = {
  env: process.env.NODE_ENV,
  serverHost,
  serverPort,
  redisOptions,
  resqueOptions,
  keyPrefix,
  queueName: 'il',
};

export default config;
