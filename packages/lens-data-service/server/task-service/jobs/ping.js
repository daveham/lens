const debug = require('debug')('svc:jobs-ping');
import app from 'app';

const defineJob = (jobs) => {
  jobs.ping = {
    perform: (data, cb) => {
      debug('ping perform', { data });
      if (app) {
        const socket = app.get('socket');
        socket.emit('il-pong', { status: 'task complete' });
      }
      cb();
    }
  };
};

export default defineJob;
