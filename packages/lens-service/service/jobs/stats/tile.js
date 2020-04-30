import { makeStatsKey, pathFromImageDescriptor } from '@lens/image-descriptors';
import co from 'co';
import { getRedisClient, respond, respondWithError } from '../../../server/context';
import toBuffer from '../utils/gmBuffer';
import tileStats from '../utils/tileStat';
import fileExists from '../utils/fileExists';
import { generator as tileGenerator } from '../image/tile';
import { basicHashKey } from './constants';

import getDebugLog from '../debugLog';
const debug = getDebugLog('stats:tile');

function* tileStatsGenerator(imageDescriptor, key) {
  const filename = pathFromImageDescriptor(imageDescriptor);
  const imageExists = yield fileExists(filename);
  if (!imageExists) {
    yield* tileGenerator(imageDescriptor);
  }

  const buffer = yield toBuffer(filename);
  const stats = yield tileStats(buffer);

  const data = {
    filename,
    ...stats,
  };
  const payload = { status: 'ok', data };
  const result = yield getRedisClient().hset(key, basicHashKey, JSON.stringify(payload));
  if (result !== 0 && result !== 1) {
    debug('stats redis.hset failed', { result });
  }
  return data;
}

export function processTile(job) {
  const { statsDescriptor } = job;
  const statsKey = makeStatsKey(statsDescriptor);

  return co(tileStatsGenerator(statsDescriptor.imageDescriptor, statsKey))
    .then(data => {
      respond(job, { data });
    })
    .catch(error => {
      getRedisClient().hset(statsKey, basicHashKey, JSON.stringify({ status: 'bad', error }));
      respondWithError(job, error);
    });
}
