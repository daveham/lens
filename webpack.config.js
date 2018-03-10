const webpack = require('webpack');
const autoprefixer = require('autoprefixer');

const isDevelopment = process.argv.indexOf('-p') === -1;

let publicPath;
let rules;
let plugins;
if (isDevelopment) {
  publicPath = '/lens/build/';

  rules = [
    {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    },
    {
      test: /\.(scss|sass)$/,
      include: [`${__dirname}/src/`],
      exclude: /node_modules/,
      use: [
        require.resolve('style-loader'),
        {
          loader: require.resolve('css-loader'),
          options: {
            importLoaders: 1,
            modules: true,
            localIdentName: '[name]__[local]__[hash:base64:5]'
          }
        },
        {
          loader: require.resolve('postcss-loader'),
          options: {
            // Necessary for external CSS imports to work
            // https://github.com/facebookincubator/create-react-app/issues/2677
            ident: 'postcss',
            plugins: () => [
              require('postcss-flexbugs-fixes'),
              autoprefixer({
                browsers: [
                  '>1%',
                  'last 4 versions',
                  'Firefox ESR',
                  'not ie < 9' // React doesn't support IE8 anyway
                ],
                flexbox: 'no-2009'
              })
            ]
          }
        },
        require.resolve('sass-loader')
      ]
    }
  ];

  plugins = [];
} else {
  publicPath = '/build/';

  rules = [
    { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' }
  ];

  plugins = [
    new webpack.optimize.UglifyJsPlugin({
      output: {
        comments: false
      }
    })
  ];
}

module.exports = {
  entry: `${__dirname}/src/index.js`,
  output: {
    path: `${__dirname}/build`,
    publicPath,
    filename: 'bundle.js'
  },
  module: { rules },
  plugins
};
