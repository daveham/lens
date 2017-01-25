import WebpackHotMiddleware from 'webpack-hot-middleware';
import _debug from 'debug';

const debug = _debug('srv:server-webpack-hmr');

export default function (compiler, opts) {
  debug('Enable Webpack Hot Module Replacement (HMR).');

  return WebpackHotMiddleware(compiler, opts);
}
