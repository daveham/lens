import restify from 'restify';
import corsMiddleware from 'restify-cors-middleware';

import config from '../config';

import routes from '../routes';

import bunyan from 'bunyan';
import _debug from 'debug';
const debug = _debug('lens:api:server');

const cors = corsMiddleware({
  origins: ['*']
});

const name = 'lens-rest-api';
const log = bunyan.createLogger({
  name,
  streams: [{
    level: 'info',
    stream: process.stdout
  }],
  serializers: bunyan.stdSerializers
});

const server = restify.createServer({ name, log });

server.pre(cors.preflight);
server.use(cors.actual);

server.use(restify.plugins.bodyParser());

routes(server);

server.get( /\/thumbs\//, restify.plugins.serveStatic({
  directory: '/data'
}));
server.get( /\/tiles\//, restify.plugins.serveStatic({
  directory: '/data'
}));

server.listen(config.server_port, config.server_host, () => {
  debug(`${server.name} listening at ${server.url}`);
});
