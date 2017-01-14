import path from 'path';
import fs from 'fs';
import mkdirp from 'mkdirp';
import config from 'config';

const debug = require('debug')('app:api-util');

const paths = config.utils_paths;
const catalogDataFile = path.join(paths.base(config.dir_data), 'data.json');

export const loadCatalog = (cb) => {
  debug('reading catalog file from', catalogDataFile);
  fs.readFile(catalogDataFile, 'utf8', (err, data) => {
    if (err) {
      debug('loadCatalog error', err);
      return cb(err);
    }

    // TODO: catch exception in JSON parsing
    cb(null, JSON.parse(data));
  });
};

export const loadSource = (id, cb) => {
  loadCatalog((err, catalog) => {
    if (err) {
      debug('loadSource error', err);
      return cb(err);
    }

    const item = catalog.sources.find(source => source.id === id);
    if (item) return cb(null, item);

    cb(new Error(`source item ${id} not found`));
  });
};

export const statPromise = target => {
  return new Promise((resolve, reject) => {
    fs.stat(target, (err, stats) => {
      if (err) {
        debug('file stat error', err);
        return reject(new Error(err));
      }

      if (!stats.isFile()) {
        debug('not a file', target);
        return reject(new Error(`${target} is not a file`));
      }

      debug('file stats', stats);
      resolve(stats);
    });
  });
};

export const writeJsonCachePromise = (cachePath, file, cacheData) => {
  return new Promise((resolve, reject) => {
    mkdirp(cachePath, (err) => {
      debug('ignoring mkdir error', err);
      const fullFile = path.join(cachePath, file);
      fs.writeFile(fullFile, JSON.stringify(cacheData), (err) => {
        if (err) {
          debug('write cache promise error', err);
          return reject(new Error(err));
        }
        debug('wrote cache file', fullFile);
        resolve(true);
      });
    });
  });
};
