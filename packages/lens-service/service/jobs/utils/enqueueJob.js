import config, { getQueue } from '../../../config';

import _debug from 'debug';
const debug = _debug('lens:service:enqueueJob');

const enqueueJob = async job => {
  const { command } = job;
  debug(`enqueueJob '${command}'`, job);
  const queue = await getQueue();
  await queue.enqueue(config.queueName, command, [job]);
  return job;
};

export default enqueueJob;
