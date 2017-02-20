const debug = require('debug')('svc:jobs-stats');
import app from 'server/app';

const defineJob = (jobs) => {
  jobs.stats = {
    perform: (job, cb) => {
      const { jobId, timestamp } = job;
      debug('stats perform', { jobId, timestamp });

      if (app) {
        const socket = app.get('socket');
        const result = {
          ...job,
          timestamp: Date.now()
        };
        debug('stats job duration', result.timestamp - timestamp);

        result.status = 'complete';
        result.data = { xyzzy: 1 };

        socket.emit('job', result);
        cb();
      } else {
        debug('oops: no socket to use');
        cb();
      }
    }
  };
};

export default defineJob;
