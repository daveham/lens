import { makeStatsKey } from '@lens/image-descriptors';
import co from 'co';
import paths from '../../../config/paths';
import { getRedisClient, respond, respondWithError } from '../../../server/context';
import loadCatalog from '../utils/loadCatalog';
import identify from '../utils/gmIdentify';
import fileStat from '../utils/fileStat';
import { basicHashKey } from './constants';

import getDebugLog from '../debugLog';
const debug = getDebugLog('stats:source');

function* sourceStatsGenerator({ input: { id } }, key) {
  const catalog = yield loadCatalog();
  const { file } = catalog[id];

  const sourceFile = paths.resolveSourcePath(file);
  const fileResults = yield fileStat(sourceFile);
  const identifyResults = yield identify(sourceFile);
  const data = {
    ...fileResults,
    ...identifyResults,
  };
  const payload = { status: 'ok', data };
  const result = yield getRedisClient().hset(key, basicHashKey, JSON.stringify(payload));
  if (result !== 0 && result !== 1) {
    debug('stats redis.hset failed', { result });
  }
  return data;
}

export function processSource(job) {
  const { statsDescriptor } = job;
  const statsKey = makeStatsKey(statsDescriptor);

  return co(sourceStatsGenerator(statsDescriptor.imageDescriptor, statsKey))
    .then(data => {
      respond(job, { data });
    })
    .catch(error => {
      getRedisClient().hset(statsKey, basicHashKey, JSON.stringify({ status: 'bad', error }));
      respondWithError(job, error);
    });
}
