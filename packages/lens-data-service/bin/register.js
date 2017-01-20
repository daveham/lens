require('dotenv').config({ silent: false });
require('babel-register')({
  presets: ['es2015', 'stage-0'],
  plugins: [
    'transform-runtime',
    ['resolver', { resolveDirs: ['server', 'config'] }]
  ]
});

require('./start');
