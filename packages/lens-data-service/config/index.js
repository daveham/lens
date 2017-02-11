import path from 'path';
import { argv } from 'yargs';

const config = {
  env: process.env.NODE_ENV,

  server_host: process.env.USER === 'vagrant' ? '192.168.20.20' : '0.0.0.0',
  server_port: process.env.PORT || 3001,

  path_base: path.resolve(__dirname, '../'),
  dir_dist: 'dist',
  path_base_data: process.env.DATA_FOLDER || '/data',
  dir_sources: 'sources',
  dir_thumbs: 'thumbs',
  dir_stats: 'stats',
  dir_tiles: 'tiles',

  queue_connection: {
    pkg: 'ioredis',
    host: '127.0.0.1',
    password: null,
    port: 6379,
    database: 0
  },
  queue_name: 'il'
};

config.globals = {
  'process.env': {
    'NODE_ENV': JSON.stringify(config.env)
  },
  'NODE_ENV': config.env,
  '__DEV__': config.env === 'development',
  '__PROD__': config.env === 'production',
  '__DEBUG__': config.env === 'development' && !argv.no_debug
};

config.utils_paths = (() => {
  const resolve = path.resolve;

  const base = (...args) =>
    resolve.apply(resolve, [config.path_base, ...args]);

  const base_data = (...args) =>
    resolve.apply(resolve, [config.path_base_data, ...args]);

  return {
    base,
    base_data,
    dist: base.bind(null, config.dir_dist),
    sources: base_data.bind(null, config.dir_sources),
    thumbs: base_data.bind(null, config.dir_thumbs),
    stats: base_data.bind(null, config.dir_stats),
    tiles: base_data.bind(null, config.dir_tiles)
  };
})();

export default config;
