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

export default {
  post: (req, res, next) => {
    const { clientId, statsDescriptor } = req.body;
    debug('POST stats', { clientId, statsDescriptor });

    debug('isTileStatsDescriptor',
      isTileStatsDescriptor(statsDescriptor),
      isThumbnailStatsDescriptor(statsDescriptor),
      isSourceStatsDescriptor(statsDescriptor));

    const statsKey = makeStatsKey(statsDescriptor);
    config.getRedisClient().get(statsKey)
    .then((data) => {
      debug('redis get', { statsKey, data });
      if (!data) {
        config.getRedisClient().set(statsKey, 'xyzzy')
        .then((result) => {
          debug('redis set', { statsKey, result });
        });
      }
    });

    loadCatalog((err, catalog) => {
      if (err) {
        debug('createStats loadCatalog error', { err });
        res.send(err);
        next();
      } else {
        const { id } = statsDescriptor.imageDescriptor.input;
        const foundSource = catalog.sources.find((source) => source.id === id);
        if (!foundSource) {
          debug(`createStats did not find source with id ${id}`);
          res.send(new Error(`Did not find source with id ${id}`));
          return next();
        }

        enqueueJob(createStats(clientId, statsDescriptor, foundSource.file), (status) => {
          res.send(status);
          next();
        });
      }
    });
  }
};
