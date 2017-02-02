require('babel-register')({
  presets: ['es2015', 'react', 'stage-0'],
  plugins: [
    'add-module-exports', 'transform-runtime',
    ['module-resolver', {
      root: ['.']
    }]
  ],
  babelrc: false
});
