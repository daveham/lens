import { queue as Queue } from 'node-resque';
import config from '../../config';

import _debug from 'debug';
const debug = _debug('lens:api-utils');

export const enqueueJob = (job, cb) => {
  const queue = new Queue({ connection: config.queue_connection });
  queue.on('error', (error) => {
    debug(error);
    cb(error);
  });
  queue.connect(() => {
    const { command } = job;
    debug(`enqueue job for ${command}`, job);
    queue.enqueue(config.queue_name, command, job);
    cb(job);
  });
};
