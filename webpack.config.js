const webpack = require('webpack');

const isDevelopment = process.argv.indexOf('-p') === -1;

const publicPath = isDevelopment ? 'lens/build' : 'build';

module.exports = {
  entry: `${__dirname}/src/index.js`,
  output: {
    path: `${__dirname}/build`,
    publicPath: `/${publicPath}/`,
    filename: 'bundle.js',
  },

  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
    ],
  },

  plugins: isDevelopment ? [] : [
    new webpack.optimize.UglifyJsPlugin({
      output: {
        comments: false,
      },
    }),
  ],
};
