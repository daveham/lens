import _debug from 'debug';
const debug = _debug('lens:api-stats-utils');

export function handleStatsError(redis, res, next, statsKey, err) {
  debug('handleStatsError', { err });
  const payload = {
    status: 'bad',
    error: err
  };
  res.send(payload);
  next();
  redis.set(statsKey, JSON.stringify({ status: 'bad', error: err }));
}
