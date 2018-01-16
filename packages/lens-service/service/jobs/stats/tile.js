import { makeStatsKey } from '@lens/image-descriptors';
import config from '../../../config';
import { sendResponse } from '../../worker';
import { respondWithError } from '../utils';

import debugLib from 'debug';
const debug = debugLib('lens:jobs-stats-tile');

export function processTile(job, cb) {
  const { statsDescriptor } = job;
  const filename = job.sourceFilename || statsDescriptor.imageDescriptor.input.file;

  const payload = {
    status: 'ok',
    data: {
      filename
    }
  };
  const statsKey = makeStatsKey(statsDescriptor);
  config.getRedisClient().set(statsKey, JSON.stringify(payload))
  .then((result) => {
    if (result !== 'OK') {
      debug('stats redis.set failed', { result });
    }
    sendResponse({ ...job, data: payload.data });
    cb();
  })
  .catch(error => {
    debug('stats error', { error });
    const payload = {
      status: 'bad',
      error
    };
    config.getRedisClient().set(statsKey, JSON.stringify(payload));
    respondWithError(error, job, cb);
  });
}
