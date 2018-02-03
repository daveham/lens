import _debug from 'debug';
const debug = _debug('lens:connections');

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
        duration: 0
      };
      socket.emit('flash', response);
      return;
    }
    debug(`did not find connection for socket ${socket.id}`);
  },

  addConnectionForSocket(socket) {
    debug('addConnectionForSocket', socket.id);
    this.connectionsBySocketId[socket.id] = { socket, clientId: -1 };

    socket.on('disconnect', () => this.removeConnectionForSocket(socket));
    socket.on('flash', (data) => {
      if (data.command === 'register') {
        this.registerClient(socket, data);
      }
    });
  }
};

export default connections;
