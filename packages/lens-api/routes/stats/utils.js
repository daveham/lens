import getDebugLog from './debugLog';
const debug = getDebugLog('utils');

export function handleStatsError(redis, res, next, statsKey, hashKey, err) {
  debug('handleStatsError', { err });
  const payload = {
    status: 'bad',
    error: err,
  };
  res.send(payload);
  next();
  redis.hset(statsKey, hashKey, JSON.stringify({ status: 'bad', error: err }));
}

export const basicHashKey = 'basic';
