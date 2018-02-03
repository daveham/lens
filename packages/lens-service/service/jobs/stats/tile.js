import {
  makeStatsKey,
  pathFromImageDescriptor
} from '@lens/image-descriptors';
import co from 'co';
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

export function processTile(context, job, cb) {
  const redis = job.worker.options.context.getRedisClient();
  const { statsDescriptor } = job;
  const statsKey = makeStatsKey(statsDescriptor);

  co(generator(statsDescriptor.imageDescriptor, statsKey, redis))
  .then((data) => {
    context.sendResponse({ ...job, data });
    cb();
  })
  .catch((error) => {
    debug('processTile error', { error });
    redis.set(statsKey, JSON.stringify({ status: 'bad', error }));
    context.respondWithError(error, job, cb);
  });
}
