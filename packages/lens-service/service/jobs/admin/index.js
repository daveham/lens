import { getResponseSocket } from '../../worker';

import debugLib from 'debug';
const debug = debugLib('lens:jobs-ping');

export default (jobs) => {
  jobs.ping = {
    perform: (job, cb) => {
      const { clientId, jobId, timestamp } = job;
      debug('ping perform', { clientId, jobId, timestamp });
      const socket = getResponseSocket(clientId);
      if (socket) {
        debug('job response socket', socket.id);
        const result = {
          ...job,
          command: 'pong',
          timestamp: Date.now()
        };
        debug('ping job duration', result.timestamp - timestamp);
        socket.emit('job', result);
      } else {
        debug('no socket available for response');
      }
      cb();
    }
  };
};
