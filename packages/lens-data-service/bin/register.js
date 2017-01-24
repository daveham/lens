require('dotenv').config();
require('babel-register')({
  presets: ['es2015', 'stage-0'],
  plugins: [
    'add-module-exports', 'transform-runtime',
    ['resolver', { resolveDirs: ['server', 'config'] }]
  ],
  babelrc: false
});

require('./start');
