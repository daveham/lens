import config, { getQueue } from '../../../config';

import getDebugLog from './debugLog';
const debug = getDebugLog('enqueueJob');

const enqueueJob = async job => {
  const { command } = job;
  debug(`enqueueJob '${command}'`, job);
  const queue = await getQueue();
  await queue.enqueue(config.queueName, command, [job]);
  return job;
};

export default enqueueJob;
