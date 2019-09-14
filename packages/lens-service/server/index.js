import restify from 'restify';
import path from 'path';
import socketio from 'socket.io';
import bunyan from 'bunyan';
import mkdirp from 'mkdirp';

import config from '../config';
import { data } from '../config/paths';
import service from '../service';
import context from './context';

import _debug from 'debug';
const debug = _debug('lens:service-server');

const name = 'lens-service';
const log = bunyan.createLogger({
  name,
  streams: [{
    level: 'info',
    stream: process.stdout
  }],
  serializers: bunyan.stdSerializers
});

mkdirp.sync(path.join(data, 'stats'));
mkdirp.sync(path.join(data, 'thumbs'));

const server = restify.createServer({ name, log });
const io = socketio.listen(server.server);

server.get('/', (req, res, next) => {
  next();
});

let serviceStarted = false;
io.sockets.on('connect', (socket) => {
  debug('socket connected', socket.id);
  context.connections.addConnectionForSocket(socket);

  if (!serviceStarted) {
    serviceStarted = true;

    service(context, () => {
      debug('Queued job service is running.');
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
