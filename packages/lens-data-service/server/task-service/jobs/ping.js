const debug = require('debug')('svc:jobs-ping');
import app from 'server/app';

const defineJob = (jobs) => {
  jobs.ping = {
    perform: (job, cb) => {
      const { jobId, timestamp } = job;
      debug('ping perform', { jobId, timestamp });
      if (app) {
        const socket = app.get('socket');
//        socket.emit('il-pong', {
//          jobId,
//          timestamp,
//          status: 'task complete'
//        });
        debug('ping job duration', Date.now() - timestamp);
        socket.emit('il-job-complete', job);
      }
      cb();
    }
  };
};

export default defineJob;
