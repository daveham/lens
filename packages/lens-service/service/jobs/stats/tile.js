import {
  makeStatsKey,
  pathFromImageDescriptor
} from '@lens/image-descriptors';
import co from 'co';
import toBuffer from '../utils/gmBuffer';
import tileStats from '../utils/tileStat';
import fileExists from '../utils/fileExists';
import { generator as tileGenerator } from '../image/tile';

import debugLib from 'debug';
const debug = debugLib('lens:jobs-stats-tile');

function* generator(imageDescriptor, key, context) {
  const filename = pathFromImageDescriptor(imageDescriptor);
  const imageExists = yield fileExists(filename);
  if (!imageExists) {
    yield *tileGenerator(imageDescriptor, context);
  }

  const buffer = yield toBuffer(filename);
  const stats = yield tileStats(buffer);

  const data = {
    filename,
    ...stats
  };
  const payload = { status: 'ok', data };
  const result = yield context.getRedisClient().set(key, JSON.stringify(payload));
  if (result !== 'OK') {
    debug('stats redis.set failed', { result });
  }
  return data;
}

export function processTile(context, job, cb) {
  const { statsDescriptor } = job;
  const statsKey = makeStatsKey(statsDescriptor);

  co(generator(statsDescriptor.imageDescriptor, statsKey, context))
  .then((data) => {
    context.respond({ ...job, data });
    cb();
  })
  .catch((error) => {
    context.getRedisClient().set(statsKey, JSON.stringify({ status: 'bad', error }));
    context.respondWithError(error, job);
    cb();
  });
}
