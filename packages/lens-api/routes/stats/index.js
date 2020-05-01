import errors from 'restify-errors';
import {
  isTileStatsDescriptor,
  isSourceStatsDescriptor,
  makeStatsKey,
} from '@lens/image-descriptors';
import config from '../../config';
import { handleStatsError, basicHashKey } from './utils';
import { requestSourceStats } from './source';
import { requestTileStats } from './tile';

import getDebugLog from './debugLog';
const debug = getDebugLog();

const post = (req, res, next) => {
  const { clientId, statsDescriptor } = req.body;
  debug('POST stats', { clientId, statsDescriptor });

  const redis = config.getRedisClient();
  const statsKey = makeStatsKey(statsDescriptor);
  redis.hget(statsKey, basicHashKey).then(statsData => {
    if (statsData) {
      res.send(JSON.parse(statsData));
      return next();
    }

    return redis
      .hset(statsKey, basicHashKey, JSON.stringify({ status: 'pending' }))
      .then(statsPendingResult => {
        if (statsPendingResult !== 0 && statsPendingResult !== 1) {
          debug('redis hset', { statsPendingResult });
        }

        if (isTileStatsDescriptor(statsDescriptor)) {
          return requestTileStats(clientId, statsDescriptor, statsKey, res, next);
        }

        if (isSourceStatsDescriptor(statsDescriptor)) {
          return requestSourceStats(clientId, statsDescriptor, statsKey, res, next);
        }

        return handleStatsError(
          redis,
          res,
          next,
          statsKey,
          basicHashKey,
          new errors.InternalServerError({ message: 'bad stats request' }),
        );
      });
  });
};

export function addRoutes(server) {
  server.post('/stats', post);
}
