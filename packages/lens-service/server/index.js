import restify from 'restify';
import path from 'path';
import socketio from 'socket.io';
import { createLogger } from 'feller-buncher';
import mkdirp from 'mkdirp';

import config from '../config';
import { data } from '../config/paths';
import service from '../service';
import connections from './connections';

import _debug from 'debug';
const debug = _debug('lens:service-server');

const name = 'lens-service';
const log = createLogger({
  name,
  streams: [
    {
      level: 'info',
      stream: process.stdout,
    },
  ],
});

mkdirp.sync(path.join(data, 'stats'));
mkdirp.sync(path.join(data, 'thumbs'));

const server = restify.createServer({ name, log });
const io = socketio.listen(server.server);

server.get('/', (req, res, next) => {
  next();
});

let serviceStarted = false;
io.sockets.on('connect', socket => {
  debug('socket connected', socket.id);
  connections.addConnectionForSocket(socket);

  if (!serviceStarted) {
    service().then(() => {
      serviceStarted = true;
      debug('Queued job service is running.');
    });
  }

  socket.on('flash', data => {
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
        duration: 0,
      };
      debug('ping', { response });
      socket.emit('flash', response);
    }
  });
});

server.listen(config.serverPort, config.serverHost, () => {
  debug(`${server.name} listening at ${server.url}`);
});
