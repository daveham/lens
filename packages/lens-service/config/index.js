const usingVagrant = process.env.USER === 'vagrant';

const server_host = process.env.SERVICE_SERVER ||
  usingVagrant ? '192.168.20.20' : '0.0.0.0';

const server_port = process.env.SERVICE_PORT || process.env.PORT || 3002;

const config = {
  env: process.env.NODE_ENV,
  server_host,
  server_port
};

export default config;
