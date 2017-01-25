import WebpackDevMiddleware from 'webpack-dev-middleware';
import _debug from 'debug';
import config from 'config';

const paths = config.utils_paths;
const debug = _debug('srv:server-webpack-dev');

export default function (compiler, publicPath) {
  debug('Enable Webpack dev middleware.');

  /* eslint key-spacing:0 */
  return WebpackDevMiddleware(compiler, {
    publicPath,
    contentBase : paths.base(config.dir_client),
    hot         : true,
    quiet       : config.compiler_quiet,
    noInfo      : config.compiler_quiet,
    lazy        : false,
    stats       : config.compiler_stats
  });
}
