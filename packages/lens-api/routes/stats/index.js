import errors from 'restify-errors';
import { createStats } from '@lens/data-jobs';
import {
  isTileStatsDescriptor,
  isThumbnailStatsDescriptor,
  isSourceStatsDescriptor,
  makeStatsKey
} from '@lens/image-descriptors';
import { enqueueJob } from '../utils/index';
import { loadCatalog } from '../utils';
import config from '../../config';

import _debug from 'debug';
const debug = _debug('lens:api-stats');

function handleStatsError(redis, res, next, statsKey, err) {
  debug('handleStatsError', { err });
  const payload = {
    status: 'bad',
    error: err
  };
  res.send(payload);
  next();
  redis.set(statsKey, JSON.stringify({ status: 'bad', error: err }));
}

export default {
  post: (req, res, next) => {
    const { clientId, statsDescriptor } = req.body;
    debug('POST stats', { clientId, statsDescriptor });

    debug('tile/thumbnail/source',
      isTileStatsDescriptor(statsDescriptor),
      isThumbnailStatsDescriptor(statsDescriptor),
      isSourceStatsDescriptor(statsDescriptor));

    const redis = config.getRedisClient();
    const statsKey = makeStatsKey(statsDescriptor);
    redis.get(statsKey)
    .then((statsData) => {
      debug('redis get', { statsKey, statsData });
      if (statsData) {
        debug('parsed', JSON.parse(statsData));
        res.send(JSON.parse(statsData));
        return next();
      }

      return redis.set(statsKey, JSON.stringify({ status: 'pending' }))
      .then((statsPendingResult) => {
        debug('redis set', { statsPendingResult });

        return loadCatalog((err, catalog) => {
          if (err) {
            return handleStatsError(redis, res, next, statsKey,
              new errors.InternalServerError(err, 'load catalog'));
          }

          const { id } = statsDescriptor.imageDescriptor.input;
          const foundSource = catalog.sources.find((source) => source.id === id);
          if (!foundSource) {
            return handleStatsError(redis, res, next, statsKey,
              new errors.ResourceNotFoundError({ message: `Did not find source with id ${id}` }));
          }

          return enqueueJob(createStats(clientId, statsDescriptor, foundSource.file), (status) => {
            debug('createStats - enqueueJob', { status });
            res.send({ status: 'pending' });
            next();
          });
        });
      });
    });
  }
};
