import config from 'config';
import app from 'server/app';
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

const host = config.server_host;
const port = config.server_port;

httpServer.listen(port, host, () => {
  debug(`Server is now running at ${host}:${port}.`);
});

import startTaskService from 'server/task-service';
startTaskService(() => {
  debug('Task service is running.');
});
