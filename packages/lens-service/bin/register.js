require('dotenv').config();

require('babel-register')({
  presets: ['es2015', 'stage-0'],
  plugins: [
    'add-module-exports', 'transform-runtime',
    ['module-resolver', {
      root: ['.']
    }]
  ],
  babelrc: false
});

require('../server');
