import { Queue } from 'node-resque';
import config from '../../../config';

import _debug from 'debug';
const debug = _debug('lens:service:enqueueJob');

let _queue;
const getQueue = async () => {
  if (_queue) {
    return _queue;
  }
  debug('getQueue - defining new queue');
  _queue = new Queue({ connection: config.queueConnection });
  _queue.on('error', error => {
    debug('getQueue error', { error });
    _queue = undefined;
  });
  await _queue.connect();
  return _queue;
};

const enqueueJob = async job => {
  const queue = await getQueue();
  const { command } = job;
  debug(`enqueueJob '${command}'`, job);
  await queue.enqueue(config.queueName, command, [job]);
  return job;
};

export default enqueueJob;
