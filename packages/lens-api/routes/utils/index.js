import { queue as Queue } from 'node-resque';
import config from '../../config';
import path from 'path';
import fs from 'fs';
import NodeCache from 'node-cache';
import paths from '../../config/paths';

import _debug from 'debug';
const debug = _debug('lens:api-utils');

export const enqueueJob = (job, cb) => {
  const queue = new Queue({ connection: config.queue_connection });
  queue.on('error', (error) => {
    debug(error);
    cb(error);
  });
  queue.connect(() => {
    const { command } = job;
    debug(`enqueue job for ${command}`, job);
    queue.enqueue(config.queue_name, command, job);
    cb(job);
  });
};

const catalogCacheKey = 'lens-catalog';
const catalogCacheTTLSeconds = 10;
const catalogCache = new NodeCache({ stdTTL: catalogCacheTTLSeconds });
const catalogDataFile = path.join(paths.data, 'data.json');

export const loadCatalog = (cb) => {
  let catalog = catalogCache.get(catalogCacheKey);
  if (catalog) {
    return cb(null, catalog);
  }

  fs.readFile(catalogDataFile, 'utf8', (err, data) => {
    if (err) {
      debug('loadCatalog error', err);
      return cb(err);
    }

    // TODO: catch exception in JSON parsing
    catalog = JSON.parse(data);
    catalogCache.set(catalogCacheKey, catalog);
    cb(null, catalog);
  });
};
