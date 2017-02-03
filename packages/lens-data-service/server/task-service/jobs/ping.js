const debug = require('debug')('svc:jobs-ping');
import app from 'server/app';

const defineJob = (jobs) => {
  jobs.ping = {
    perform: (job, cb) => {
      const { jobId, timestamp } = job;
      debug('ping perform', { jobId, timestamp });
      if (app) {
        const socket = app.get('socket');
        debug('ping job duration', Date.now() - timestamp);
        const result = {
          ...job,
          command: 'pong',
          timestamp: Date.now()
        };
        socket.emit('job', result);
      }
      cb();
    }
  };
};

export default defineJob;
