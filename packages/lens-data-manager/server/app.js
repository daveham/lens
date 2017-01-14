import express from 'express';
import webpack from 'webpack';
import webpackConfig from '../build/webpack.config';
import path from 'path';
import logger from 'morgan';
import bodyParser from 'body-parser';
import history from 'connect-history-api-fallback';
import _debug from 'debug';
import config from 'config';
import mkdirp from 'mkdirp';
import webpackDevMiddleware from './middleware/webpack-dev';
import webpackHMRMiddleware from './middleware/webpack-hmr';

const debug = _debug('app:server');
const paths = config.utils_paths;

import { configureApi } from 'api';

const app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const router = express.Router();
configureApi(router);
app.use('/api', router);

const thumbsData = path.join(paths.base(config.dir_data), 'thumbs');
mkdirp.sync(thumbsData);
debug(`serving thumbs from '${thumbsData}'`);
app.use('/thumbs', express.static(thumbsData));

const tilesData = path.join(paths.base(config.dir_data), 'tiles');
mkdirp.sync(tilesData);
debug(`serving tiles from '${tilesData}'`);
app.use('/tiles', express.static(tilesData));

app.use(history({
  verbose: false
}));

if (config.env === 'development') {
  const compiler = webpack(webpackConfig);

  // Enable webpack-dev and webpack-hot middleware
  const { publicPath } = webpackConfig.output;

  app.use(webpackDevMiddleware(compiler, publicPath));
  app.use(webpackHMRMiddleware(compiler));

  // Serve static assets from ~/src/static since Webpack is unaware of
  // these files. This middleware doesn't need to be enabled outside
  // of development since this directory will be copied into ~/dist
  // when the application is compiled.
  app.use(express.static(paths.client('static')));

  app.use((req, res /*, next */) => {
    debug('express 404 handler', req.path);
    res.status(404).send('Sorry, cannot find that!');
  });

  app.use((err, req, res /*, next */) => {
    debug('express error handler', err.stack);
    res.status(err.statusCode || 500).json(err);
  });
} else {
  debug(
    'Server is being run outside of live development mode. This starter kit ' +
    'does not provide any production-ready server functionality. To learn ' +
    'more about deployment strategies, check out the "deployment" section ' +
    'in the README.'
  );

  // Serving ~/dist by default. Ideally these files should be served by
  // the web server and not the app server, but this helps to demo the
  // server in production.
  app.use(express.static(paths.base(config.dir_dist)));
}

export default app;
