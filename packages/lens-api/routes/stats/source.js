import errors from 'restify-errors';
import { createStats } from '@lens/data-jobs';
import config from '../../config';
import { loadCatalog, enqueueJob } from '../utils';
import { handleStatsError, basicHashKey } from './utils';

import _debug from 'debug';
const debug = _debug('lens:api-stats-source');

export function requestSourceStats(clientId, statsDescriptor, statsKey, res, next) {
  const redis = config.getRedisClient();
  return loadCatalog((err, catalog) => {
    if (err) {
      return handleStatsError(redis, res, next, statsKey, basicHashKey,
        new errors.InternalServerError(err, 'load catalog'));
    }

    const { id } = statsDescriptor.imageDescriptor.input;
    const foundSource = catalog.sources.find((source) => source.id === id);
    if (!foundSource) {
      return handleStatsError(redis, res, next, statsKey, basicHashKey,
        new errors.ResourceNotFoundError({ message: `Did not find source with id ${id}` }));
    }

    return enqueueJob(createStats(clientId, statsDescriptor, foundSource.file), (status) => {
      debug('createStats - enqueueJob', { status });
      res.send({ status: 'pending' });
      next();
    });
  });
}
