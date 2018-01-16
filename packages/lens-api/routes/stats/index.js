import errors from 'restify-errors';
import {
  isTileStatsDescriptor,
  isThumbnailStatsDescriptor,
  isSourceStatsDescriptor,
  makeStatsKey
} from '@lens/image-descriptors';
import config from '../../config';
import { handleStatsError } from './utils';
import { requestSourceStats } from './source';
import { requestTileStats} from './tile';

import _debug from 'debug';
const debug = _debug('lens:api-stats');

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
        if (statsPendingResult !== 'OK') {
          debug('redis set', { statsPendingResult });
        }

        if (isTileStatsDescriptor(statsDescriptor)) {
          return requestTileStats(clientId, statsDescriptor, statsKey, res, next);
        }

        if (isSourceStatsDescriptor(statsDescriptor)) {
          return requestSourceStats(clientId, statsDescriptor, statsKey, res, next);
        }

        return handleStatsError(redis, res, next, statsKey,
          new errors.InternalServerError({ message: 'bad stats request' }));
      });
    });
  }
};
