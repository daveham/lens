import { makeStatsKey } from '@lens/image-descriptors';
import co from 'co';
import paths from '../../../config/paths';
import loadCatalog from '../utils/loadCatalog';
import identify from '../utils/gmIdentify';
import fileStat from '../utils/fileStat';

import debugLib from 'debug';
const debug = debugLib('lens:jobs-stats-source');

function* generator({ input: { id } }, key, context) {
  const catalog = yield loadCatalog(context);
  const { file } = catalog[id];

  const sourceFile = paths.resolveSourcePath(file);
  const fileResults = yield fileStat(sourceFile);
  const identifyResults = yield identify(sourceFile);
  const data = {
    ...fileResults,
    ...identifyResults
  };
  const payload = { status: 'ok', data };
  const result = yield context.getRedisClient().set(key, JSON.stringify(payload));
  if (result !== 'OK') {
    debug('stats redis.set failed', { result });
  }
  return data;
}

export function processSource(context, job, cb) {
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
