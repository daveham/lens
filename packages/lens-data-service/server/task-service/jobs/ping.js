const debug = require('debug')('svc:jobs-ping');
import app from 'app';

const defineJob = (jobs) => {
  jobs.ping = {
    perform: ({ id, timestamp }, cb) => {
      debug('ping perform', { id, timestamp });
      if (app) {
        const socket = app.get('socket');
        socket.emit('il-pong', {
          id,
          timestamp,
          status: 'task complete'
        });
      }
      cb();
    }
  };
};

export default defineJob;
