import getDebugLog from './debugLog';
const debug = getDebugLog('connections');

const connections = {
  clientIdCounter: 0,
  connectionsBySocketId: {},
  connectionsByClientId: {},

  getConnectionByClientId(clientId) {
    debug('getConnectionByClientId', clientId);
    const connection = this.connectionsByClientId[clientId];
    if (connection) {
      return connection.socket;
    }
    debug(`did not find connection for client ${clientId}`);
  },

  removeConnectionForSocket(socket) {
    const { id } = socket;
    debug('removeConnectionForSocket', id);
    const connection = this.connectionsBySocketId[id];
    if (connection) {
      delete this.connectionsBySocketId[id];
      if (connection.clientId >= 0) {
        delete this.connectionsByClientId[connection.clientId];
      }
      return;
    }
    debug(`did not find connection for socket ${socket.id}`);
  },

  registerClient(socket, data) {
    const clientId = ++this.clientIdCounter;
    debug(`adding connection for client ${clientId} for socket ${socket.id}`);

    const connection = this.connectionsBySocketId[socket.id];
    if (connection) {
      connection.clientId = clientId;
      this.connectionsByClientId[clientId] = connection;
      const started = Date.now();
      const waited = started - data.created;
      const response = {
        ...data,
        clientId,
        command: 'registered',
        started,
        finished: started,
        waited,
        duration: 0,
      };
      socket.emit('flash', response);
      return;
    }
    debug(`did not find connection for socket ${socket.id}`);
  },

  addConnectionForSocket(socket) {
    const { id } = socket;
    debug('addConnectionForSocket', id);
    this.connectionsBySocketId[id] = { socket, clientId: -1 };

    socket.on('disconnect', () => {
      console.log('server socket disconnect', id);
      this.removeConnectionForSocket(socket);
    });
    socket.on('close', () => {
      console.log('server socket close', id);
    });
    socket.on('connect', () => {
      console.log('server socket connect', id);
    });
    socket.on('error', () => {
      console.log('server socket error', id);
    });
    socket.on('reconnect', () => {
      console.log('server socket reconnect', id);
    });
    // socket.on('close', () => {
    //   console.log('server socket close');
    // });

    socket.on('flash', data => {
      console.log('server socket flash', id);
      if (data.command === 'register') {
        this.registerClient(socket, data);
      }
    });
  },
};

export default connections;
