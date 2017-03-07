import app from 'server/app';

import debugLib from 'debug';
const debug = debugLib('svc:jobs-ping');

export default (jobs) => {
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
