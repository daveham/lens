import restify from 'restify';
import socketio from 'socket.io';

import config from '../config';
import start from '../service';

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

let clientIdCounter = 0;
const connectionsBySocketId = {};
const connectionsByClientId = {};

const getResponseSocket = (clientId) => {
  debug('getResponseSocket', clientId);
  const connection = connectionsByClientId[clientId];
  if (connection) {
    return connection.socket;
  }
};


let serviceStarted = false;
io.sockets.on('connect', (socket) => {
  debug('socket connected', socket.id);
  connectionsBySocketId[socket.id] = { socket, clientId: -1 };

  if (!serviceStarted) {
    serviceStarted = true;

    start(getResponseSocket, () => {
      debug('Task service is running.');
    });
  }

  socket.on('disconnect', () => {
    debug('socket disconnected', socket.id);
    const connection = connectionsBySocketId[socket.id];
    delete connectionsBySocketId[socket.id];
    if (connection.clientId >= 0) {
      delete connectionsByClientId[connection.clientId];
    }
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
    } else if (data.command === 'register') {
      const clientId = ++clientIdCounter;
      debug('adding connection for socket', socket.id);
      const connection = connectionsBySocketId[socket.id];
      connection.clientId = clientId;
      debug('adding connection for client', clientId);
      connectionsByClientId[clientId] = connection;
      const result = {
        ...data,
        clientId,
        command: 'registered',
        timestamp: Date.now()
      };
      socket.emit('flash', result);
    }
  });
});

server.listen(config.server_port, config.server_host, () => {
  debug(`${server.name} listening at ${server.url}`);
});
