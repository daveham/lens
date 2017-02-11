const debug = require('debug')('svc:jobs-thumbnail');
//import app from 'server/app';

const defineJob = (jobs) => {
  jobs.thumbnail = {
    perform: (job, cb) => {
      const { jobId, timestamp } = job;
      debug('thumbnail perform', { jobId, timestamp });
//      if (app) {
//        const socket = app.get('socket');
//        debug('ping job duration', Date.now() - timestamp);
//        const result = {
//          ...job,
//          command: 'pong',
//          timestamp: Date.now()
//        };
//        socket.emit('job', result);
//      }
      cb();
    }
  };
};

export default defineJob;
