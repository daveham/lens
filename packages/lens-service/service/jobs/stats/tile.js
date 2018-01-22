import {
  makeStatsKey,
  pathFromImageDescriptor
} from '@lens/image-descriptors';
import co from 'co';
import config from '../../../config';
import { sendResponse } from '../../worker';
import { respondWithError } from '../utils';
import toBuffer from '../utils/gmBuffer';
import tileStats from '../utils/tileStat';

import debugLib from 'debug';
const debug = debugLib('lens:jobs-stats-tile');

function* generator(imageDescriptor, key, redis) {
  const filename = pathFromImageDescriptor(imageDescriptor);

  const buffer = yield toBuffer(filename);
  const stats = yield tileStats(buffer);

  const data = {
    filename,
    ...stats
  };
  const payload = { status: 'ok', data };
  const result = yield redis.set(key, JSON.stringify(payload));
  if (result !== 'OK') {
    debug('stats redis.set failed', { result });
  }
  return data;
}

export function processTile(job, cb) {
  const redis = config.getRedisClient();
  const { statsDescriptor } = job;
  const statsKey = makeStatsKey(statsDescriptor);

  co(generator(statsDescriptor.imageDescriptor, statsKey, redis))
  .then((data) => {
    sendResponse({ ...job, data });
    cb();
  })
  .catch((error) => {
    debug('processTile error', { error });
    redis.set(statsKey, JSON.stringify({ status: 'bad', error }));
    respondWithError(error, job, cb);
  });
}
