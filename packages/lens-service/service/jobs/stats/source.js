import { makeStatsKey } from '@lens/image-descriptors';
import config from '../../../config';
import paths from '../../../config/paths';
import { sendResponse } from '../../worker';
import { respondWithError } from '../utils';
import { identify } from './imageStats';
import { fileStats } from './fileStats';

import debugLib from 'debug';
const debug = debugLib('lens:jobs-stats-source');

export function processSource(job, cb) {
  const { statsDescriptor } = job;
  const file = job.sourceFilename || statsDescriptor.imageDescriptor.input.file;
  const sourceFile = paths.resolveSourcePath(file);

  Promise.all([
    fileStats(sourceFile),
    identify(sourceFile)
  ])
  .then((results) => {
    const payload = {
      status: 'ok',
      data: {
        ...results[0],
        ...results[1]
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
    });
  })
  .catch(error => {
    debug('stats error', { error });
    const payload = {
      status: 'bad',
      error
    };
    const statsKey = makeStatsKey(statsDescriptor);
    config.getRedisClient().set(statsKey, JSON.stringify(payload));
    respondWithError(error, job, cb);
  });
}
