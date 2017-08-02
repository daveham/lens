const config = {
  env: process.env.NODE_ENV,

  server_host: process.env.USER === 'vagrant' ? '192.168.20.20' : '0.0.0.0',
  server_port: process.env.PORT || 3001
};

export default config;
