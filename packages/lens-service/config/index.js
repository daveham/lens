const usingVagrant = process.env.USER === 'vagrant';

const server_host = process.env.SERVICE_SERVER ||
  usingVagrant ? '192.168.20.20' : '0.0.0.0';

const server_port = process.env.SERVICE_PORT || process.env.PORT || 3002;

const redisOptions = {
  keyPrefix: 'lens:',
  port: 6379,
  host: '127.0.0.1',
  family: 4,
  password: null,
  db: 0
};

const resqueOptions = {
  port: 6379,
  host: '127.0.0.1',
  family: 4,
  password: null,
  db: 0
};

const config = {
  env: process.env.NODE_ENV,
  server_host,
  server_port,
  redisOptions,
  resqueOptions,
  queue_name: 'il'
};

export default config;
