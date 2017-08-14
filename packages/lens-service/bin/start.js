import restify from 'restify';
import socketio from 'socket.io';

import config from '../config';

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

io.sockets.on('connect', (socket) => {
  debug('user connected');

  socket.on('disconnect', () => {
    debug('user disconnected');
  });

  socket.on('flash', (data) => {
    debug('socket on flash', { data });
    if (data.command === 'ping') {
      const result = {
        ...data,
        command: 'pong',
        timestamp: Date.now()
      };
      socket.emit('flash', result);
    }
  });
});

server.listen(config.server_port, config.server_host, () => {
  debug(`${server.name} listening at ${server.url}`);
});
