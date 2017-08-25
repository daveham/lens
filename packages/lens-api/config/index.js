const usingVagrant = process.env.USER === 'vagrant';

const server_host = process.env.REST_SERVER ||
usingVagrant ? '192.168.20.20' : '0.0.0.0';

const server_port = process.env.REST_PORT || process.env.PORT || 3001;

const config = {
  env: process.env.NODE_ENV,
  server_host,
  server_port,

  queue_connection: {
    pkg: 'ioredis',
    host: '127.0.0.1',
    password: null,
    port: 6379,
    database: 0
  },
  queue_name: 'il'
};

export default config;
