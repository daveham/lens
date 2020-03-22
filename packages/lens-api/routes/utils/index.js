import { Queue } from 'node-resque';
import config from '../../config';
import path from 'path';
import fs from 'fs';
import NodeCache from 'node-cache';
import { dataFolder } from '../../config/paths';

import _debug from 'debug';
const debug = _debug('lens:api-utils');

let _queue;
const getQueue = async () => {
  if (_queue) {
    return _queue;
  }
  debug('getQueue - defining new queue');
  _queue = new Queue({ connection: config.queueConnection });
  _queue.on('error', (error) => {
    debug('getQueue error', { error });
    _queue = undefined;
  });
  await _queue.connect();
  return _queue;
};

export const enqueueJob = async (job) => {
  const queue = await getQueue();
  const { command } = job;
  debug(`enqueueJob '${command}'`, job);
  await queue.enqueue(config.queueName, command, [job]);
  return job;
};

const catalogCacheKey = 'lens-catalog';
const catalogCacheTTLSeconds = 10;
const catalogCache = new NodeCache({ stdTTL: catalogCacheTTLSeconds });
const catalogDataFile = path.join(dataFolder, 'data.json');

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
