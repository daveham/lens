import { makeStatsKey } from '@lens/image-descriptors';
import co from 'co';
import paths from '../../../config/paths';
import identify from '../utils/gmIdentify';
import fileStat from '../utils/fileStat';

import debugLib from 'debug';
const debug = debugLib('lens:jobs-stats-source');

function* generator(imageDescriptor, key, file, redis) {
  const sourceFile = paths.resolveSourcePath(file);
  const fileResults = yield fileStat(sourceFile);
  const identifyResults = yield identify(sourceFile);
  const data = {
    ...fileResults,
    ...identifyResults
  };
  const payload = { status: 'ok', data };
  const result = yield redis.set(key, JSON.stringify(payload));
  if (result !== 'OK') {
    debug('stats redis.set failed', { result });
  }
  return data;
}

export function processSource(context, job, cb) {
  const redis = context.getRedisClient();
  const { statsDescriptor } = job;
  const statsKey = makeStatsKey(statsDescriptor);
  const file = job.sourceFilename || statsDescriptor.imageDescriptor.input.file;

  co(generator(statsDescriptor.imageDescriptor, statsKey, file, redis))
  .then((data) => {
    context.sendResponse({ ...job, data });
    cb();
  })
  .catch((error) => {
    debug('processSource error', { error });
    redis.set(statsKey, JSON.stringify({ status: 'bad', error }));
    context.respondWithError(error, job, cb);
  });
}
