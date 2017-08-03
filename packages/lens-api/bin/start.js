import restify from 'restify';
import corsMiddleware from 'restify-cors-middleware';

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

routes(server);

const port = process.env.REST_PORT || 3001;
const host = process.env.REST_SERVER ||
  process.env.USER === 'vagrant' ? '192.168.20.20' : '0.0.0.0';

server.listen(port, host, () => {
  debug(`${server.name} listening at ${server.url}`);
});
