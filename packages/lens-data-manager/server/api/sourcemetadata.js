import path from 'path';
import fs from 'fs';
import rimraf from 'rimraf';
import config from 'config';
import { loadSource, statPromise, writeJsonCachePromise } from 'api/util';
import { identifyPromise } from 'api/gm-util';

const paths = config.utils_paths;

const debug = require('debug')('app:api-sourcemetadata');

const unpackStats = (dest, data) => {
  dest.ctime = data.ctime;
  dest.size = data.size;
};

const unpackIdentify = (dest, data) => {
  dest.format = data.Format;
  dest.width = data.size.width;
  dest.height = data.size.height;
  dest.depth = data.depth;
  dest.resolution = data.Resolution;
  dest.filesize = data.Filesize;
};

export default function configureApi(router) {
  debug('configure api get, delete /sourcemetadata');
  router.route('/sourcemetadata/:id')
  .get((req, res, next) => {
    const { id } = req.params;
    debug('get sourcemetadata/id', id);

    const cachePath = path.join(paths.base(config.dir_data), 'stats', id);
    const cacheFilename = 'data.json';
    const cacheFile = path.join(cachePath, cacheFilename);

    fs.readFile(cacheFile, 'utf8', (err, data) => {
      if (!err) {
        debug('using cached file');
        return res.json(JSON.parse(data));
      }

      loadSource(id, (err, source) => {
        if (err) {
          debug('loadSource error', err);
          return next(err);
        }

        const photoFile = path.join(paths.base(config.dir_data), 'sources', source.file);
        let info = { id, filename: source.file };

        Promise.all([
          statPromise(photoFile),
          identifyPromise(photoFile)
        ])
        .then((data) => {
          info.status = 'exists';

          unpackStats(info, data[0]);
          unpackIdentify(info, data[1]);

          return writeJsonCachePromise(cachePath, cacheFilename, info);
        })
        .then(() => {
          return res.json(info);
        })
        .catch(error => {
          info.error = error.message;
          info.status = 'file error';
          res.json(info);
        });
      });
    });
  })
  .delete((req, res, next) => {
    const { id } = req.params;
    debug('delete sourcemetadata/id', id);
    const cachePath = path.join(paths.base(config.dir_data), 'stats', id);

    rimraf(cachePath, (err) => {
      if (err) {
        debug('rimraf error', err);
        return next(err);
      }
      return res.sendStatus(200);
    });
  });
}
