import config from 'config';
import app from 'app';
import http from 'http';
import socketio from 'socket.io';
import _debug from 'debug';
const debug = _debug('svc:bin:app');

const httpServer = http.Server(app);

const io = socketio(httpServer);
io.on('connection', socket => {
  debug('user connected');

  app.set('socket', socket);

  socket.on('disconnect', () => {
    debug('user disconnected');
  });

  socket.on('il-ping', () => {
    debug('ping');
    socket.emit('il-pong');
  });
});

const host = config.server_host;
const port = config.server_port;

httpServer.listen(port, host, () => {
  debug(`Server is now running at ${host}:${port}.`);
});

import startTaskService from 'task-service';
startTaskService(() => {
  debug('Task service is running.');
});
