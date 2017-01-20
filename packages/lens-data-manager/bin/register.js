//require('dotenv').config({ silent: false });
require('babel-register')({
  presets: ['es2015', 'react', 'stage-0'].map(function(name) { return require.resolve('babel-preset-' + name) }),
  plugins: [
    require.resolve('babel-plugin-' + 'transform-runtime'),
    ['resolver', { resolveDirs: ['server', 'config'] }]
  ],
  ignore: function(filename) {
    if (filename.indexOf('@lens') >= 0) {
      console.log('bable-register @lens:' + filename);
      return false;
    }

    if (filename.indexOf('node_modules') >= 0) {
      //console.log('babel-register ignoring:' + filename);
      return true;
    }
    console.log('babel-register:' + filename);
    return false;
  },
  babelrc: false//,
//  parserOpts: {
//
//  }
});

require('./server');
