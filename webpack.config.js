const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const isDevelopment = process.argv.indexOf('-p') === -1;

let publicPath;
let rules;
let plugins;
let filename;
if (isDevelopment) {
  publicPath = '/';
  filename = 'bundle.js';

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

  plugins = [
    // Generates an `index.html` file.
    new HtmlWebpackPlugin({
      title: 'development',
      template: 'devTemplate.html'
    })
  ];
} else {
  publicPath = '/build/';
  filename = 'bundle.[chunkhash:8].js';
  const cssFilename = 'static/css/[name].[contenthash:8].css';
  const extractTextPluginOptions =
    // Making sure that the publicPath goes back to build folder.
    { publicPath: Array(cssFilename.split('/').length).join('../') };

  rules = [
    {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    },
    {
      test: /\.(scss|sass)$/,
      loader: ExtractTextPlugin.extract(Object.assign(
        {
          fallback: require.resolve('style-loader'),
          use: [
            {
              loader: require.resolve('css-loader'),
              options: {
                importLoaders: 1,
                modules: true,
                minimize: true,
                sourceMap: true
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
        },
        extractTextPluginOptions
      ))
      // Note: this won't work without `new ExtractTextPlugin()` in `plugins`.
    }
  ];

  plugins = [
    // Generates an `index.html` file with the <script> injected.
    new HtmlWebpackPlugin({
      inject: false,
      hash: false,
      filename: `${__dirname}/index.html`,
      template: `${__dirname}/prodTemplate.html` //,
      // minify: {
      //   removeComments: true,
      //   collapseWhitespace: true,
      //   removeRedundantAttributes: true,
      //   useShortDoctype: true,
      //   removeEmptyAttributes: true,
      //   removeStyleLinkTypeAttributes: true,
      //   keepClosingSlash: true,
      //   minifyJS: true,
      //   minifyCSS: true,
      //   minifyURLs: true
      // }
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new webpack.optimize.UglifyJsPlugin({
      output: {
        comments: false
      }
    }),
    new ExtractTextPlugin({
      filename: cssFilename
    })
  ];
}

module.exports = {
  entry: `${__dirname}/src/index.js`,
  output: {
    path: `${__dirname}/build`,
    publicPath,
    filename
  },
  module: { rules },
  plugins
};
