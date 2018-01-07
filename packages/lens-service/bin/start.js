import restify from 'restify';
import socketio from 'socket.io';

import config from '../config';
import start from '../service';

import connections from '../service/connections';

import bunyan from 'bunyan';
import _debug from 'debug';
const debug = _debug('lens:service');

const name = 'lens-service';
const log = bunyan.createLogger({
  name,
  streams: [{
    level: 'info',
    stream: process.stdout
  }],
  serializers: bunyan.stdSerializers
});

const server = restify.createServer({ name, log });

const io = socketio.listen(server.server);

server.get('/', (req, res, next) => {
  next();
});

const serviceContext = {
  connections
};


let serviceStarted = false;
io.sockets.on('connect', (socket) => {
  debug('socket connected', socket.id);
  serviceContext.connections.addConnectionForSocket(socket);

  if (!serviceStarted) {
    serviceStarted = true;

    start(serviceContext, () => {
      debug('Task service is running.');
    });
  }

  socket.on('flash', (data) => {
    debug('flash message', { command: data.command });
    if (data.command === 'ping') {
      const started = Date.now();
      const waited = started - data.created;
      const response = {
        ...data,
        command: 'pong',
        started,
        finished: started,
        waited,
        duration: 0
      };
      debug('ping', { response });
      socket.emit('flash', response);
    }
  });
});

server.listen(config.server_port, config.server_host, () => {
  debug(`${server.name} listening at ${server.url}`);
});
