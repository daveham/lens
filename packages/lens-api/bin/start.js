import process from 'process';
import restify from 'restify';
import corsMiddleware from 'restify-cors-middleware';
import { createDataManager } from '../schema';

import config from '../config';

import routes from '../routes';

import bunyan from 'bunyan';
import _debug from 'debug';
const debug = _debug('lens:api:server');

process.on('warning', (e) => debug('process.on.warn', e.stack));

const cors = corsMiddleware({
  origins: ['http://dev.local:3000'],
});

const name = 'lens-rest-api';
const apiLogger = bunyan.createLogger({
  name,
  streams: [
    {
      level: 'info',
      stream: process.stdout,
    },
  ],
  serializers: bunyan.stdSerializers,
});

const server = restify.createServer({ name, log: apiLogger });

server.pre(cors.preflight);
server.use(cors.actual);

server.use(restify.plugins.bodyParser());

server.on('uncaughtException', (req, res, route, err) => {
  apiLogger.error(err.stack);
  res.send(err);
});

createDataManager().then(mgr => {
  // static content
  server.get('/thumbs/*', restify.plugins.serveStatic({ directory: '/data' }));
  server.get('/tiles/*', restify.plugins.serveStatic({ directory: '/data' }));

  // REST API
  routes(server, mgr);

  // start listening
  server.listen(config.serverPort, config.serverHost, () => {
    debug(`${server.name} listening at ${server.url}`);
  });
});
