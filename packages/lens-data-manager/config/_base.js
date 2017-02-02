/* eslint key-spacing:0 spaced-comment:0 */
import path from 'path';
import { argv } from 'yargs';

export const VAGRANT_HOST_ADDRESS = '192.168.20.20';

const config = {
  env : process.env.NODE_ENV || 'development',

  // ----------------------------------
  // Project Structure
  // ----------------------------------
  path_base  : path.resolve(__dirname, '../'),
  dir_client : 'src',
  dir_dist   : 'dist',
  dir_server : 'server',
  dir_test   : 'tests',
  dir_data   : '../../../data',

  // ----------------------------------
  // Server Configuration
  // ----------------------------------
  server_host : process.env.USER === 'vagrant' ? VAGRANT_HOST_ADDRESS : '0.0.0.0',
  server_port : process.env.PORT || 3000,

  socket_host : process.env.USER === 'vagrant' ? VAGRANT_HOST_ADDRESS : '0.0.0.0',
  socket_port : process.env.PORT + 1 || 3001,

  // ----------------------------------
  // Compiler Configuration
  // ----------------------------------
  compiler_css_modules     : true,
  compiler_devtool         : 'source-map',
  compiler_hash_type       : 'hash',
  compiler_fail_on_warning : false,
  compiler_quiet           : false,
  compiler_public_path     : '',
  compiler_stats           : {
    chunks : false,
    chunkModules : false,
    colors : true
  },
  compiler_vendor : [
    'debug',
    'history',
    'isomorphic-fetch',
    'react',
    'react-addons-css-transition-group',
    'react-bootstrap',
    'react-dom',
    'react-redux',
    'react-router',
    'react-router-bootstrap',
    'react-router-redux',
    'redbox-react',
    'redux',
    'redux-actions',
    'redux-thunk',
    'reselect'
  ],

  // ----------------------------------
  // Test Configuration
  // ----------------------------------
  coverage_enabled   : !argv.watch,
  coverage_reporters : [
    { type : 'text-summary' },
    { type : 'html', dir : 'coverage' }
  ],

  queue_connection: {
    pkg: 'ioredis',
    host: '127.0.0.1',
    password: null,
    port: 6379,
    database: 0
  },
  queue_name: 'il'
};

/************************************************
-------------------------------------------------

All Internal Configuration Below
Edit at Your Own Risk

-------------------------------------------------
************************************************/

// ------------------------------------
// Environment
// ------------------------------------
config.globals = {
  'process.env'  : {
    'NODE_ENV' : JSON.stringify(config.env),
    'DEBUG'    : JSON.stringify(process.env.DEBUG),
    'SOCKET_HOST': JSON.stringify(`http://${config.socket_host}:${config.socket_port}`)
  },
  'NODE_ENV'     : config.env,
  '__DEV__'      : config.env === 'development',
  '__PROD__'     : config.env === 'production',
  '__TEST__'     : config.env === 'test',
  '__DEBUG__'    : config.env === 'development' && !argv.no_debug,
  '__DEBUG_NEW_WINDOW__' : !!argv.nw,
  '__BASENAME__' : JSON.stringify(process.env.BASENAME || '')
};

// ------------------------------------
// Utilities
// ------------------------------------
config.utils_paths = (() => {
  const resolve = path.resolve;

  const base = (...args) =>
    resolve.apply(resolve, [config.path_base, ...args]);

  return {
    base   : base,
    client : base.bind(null, config.dir_client),
    dist   : base.bind(null, config.dir_dist),
    data   : base.bind(null, config.dir_data)
  };
})();

export default config;
