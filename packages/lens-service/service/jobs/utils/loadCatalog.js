import fs from 'fs';
import path from 'path';
import { data } from '../../../config/paths';
import { getRedisClient } from '../../../server/context';

import _debug from 'debug';
const debug = _debug('lens:service-load-catalog');

const catalogRedisKey = 'catalog';

export default () =>
  new Promise(function(resolve, reject) {
    const redis = getRedisClient();
    redis.get(catalogRedisKey).then(cachedCatalog => {
      if (cachedCatalog) {
        return resolve(JSON.parse(cachedCatalog));
      }

      const catalogDataFile = path.join(data, 'data.json');
      fs.readFile(catalogDataFile, 'utf8', (err, data) => {
        if (err) {
          debug('readFile error', err);
          return reject(err);
        }

        const catalogData = JSON.parse(data);
        const catalog = {};
        catalogData.sources.forEach(source => (catalog[source.id] = source));

        redis.set(catalogRedisKey, JSON.stringify(catalog)).then(result => {
          if (result !== 'OK') {
            debug('redis set not OK', { result });
          }
          resolve(catalog);
        });
      });
    });
  });
