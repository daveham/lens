import app from 'server/app';

import debugLib from 'debug';
const debug = debugLib('svc:jobs-utils');

export const reportResults = (job, err, result, cb) => {
  const socket = app.get('socket');
  if (socket) {
    let payload;
    if (err) {
      debug('job error', { err });

      payload = {
        ...job,
        status: 'error'
      };
    } else {
      const timestamp = Date.now();
      debug('job duration', job.timestamp - timestamp);

      payload = {
        ...job,
        ...result,
        timestamp,
        status: 'complete'
      };
      socket.emit('job', payload);
      cb();
    }
  } else {
    debug('oops: no socket to use');
    cb();
  }
};
