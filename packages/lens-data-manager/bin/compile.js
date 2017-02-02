import config from '../config';

import _debug from 'debug';
const debug = _debug('lens:bin-compile');

debug('Create webpack compiler.');

import webpack from 'webpack';
import webpackConfig from '../build/webpack.config';
const compiler = webpack(webpackConfig);

compiler.run((err, stats) => {
  const jsonStats = stats.toJson();

  debug('Webpack compile completed.');
  debug(stats.toString(config.compiler_stats));

  if (err) {
    debug('Webpack compiler encountered a fatal error.', err);
    process.exit(1);
  } else if (jsonStats.errors.length > 0) {
    debug('Webpack compiler encountered errors.');
    process.exit(1);
  } else if (jsonStats.warnings.length > 0) {
    debug('Webpack compiler encountered warnings.');

    if (config.compiler_fail_on_warning) {
      process.exit(1);
    }
  } else {
    debug('No errors / warnings encountered.');
  }
});
