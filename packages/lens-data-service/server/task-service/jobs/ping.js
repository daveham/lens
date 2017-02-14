const debug = require('debug')('svc:jobs-ping');
import app from 'server/app';

const defineJob = (jobs) => {
  jobs.ping = {
    perform: (job, cb) => {
      const { jobId, timestamp } = job;
      debug('ping perform', { jobId, timestamp });
      if (app) {
        const socket = app.get('socket');
        const result = {
          ...job,
          command: 'pong',
          timestamp: Date.now()
        };
        debug('ping job duration', result.timestamp - timestamp);
        socket.emit('job', result);
      }
      cb();
    }
  };
};

export default defineJob;
