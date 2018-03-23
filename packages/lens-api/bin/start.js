import restify from 'restify';
import corsMiddleware from 'restify-cors-middleware';
import graphqlHTTP from 'express-graphql';
import createSchema from '../schema';

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

server.on('uncaughtException', (req, res, route, err) => {
  log.error(err.stack);
  res.send(err);
});

routes(server);

server.get( /\/thumbs\//, restify.plugins.serveStatic({
  directory: '/data'
}));
server.get( /\/tiles\//, restify.plugins.serveStatic({
  directory: '/data'
}));

const schema = createSchema({ log: (e) => log.error(e) });

server.post('/graphql', graphqlHTTP({
  schema,
  graphiql: false
}));

server.get('/graphql', graphqlHTTP({
  schema,
  graphiql: true
}));

server.listen(config.server_port, config.server_host, () => {
  debug(`${server.name} listening at ${server.url}`);
});
