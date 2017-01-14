import path from 'path';
import glob from 'glob';
import config from 'config';
import { thumbPromise } from 'api/gm-util';
const debug = require('debug')('app:api-sourcethumbs');

const paths = config.utils_paths;

export default function configureApi(router) {
  debug('configure api get, post /sourcethumbs');

  router.route('/sourcethumbs')
    .get((req, res, next) => {
      // debug('get all sourcethumbs');
      const thumbDir = path.join(paths.base(config.dir_data), 'thumbs');
      glob('*_thumb.jpg', { cwd: thumbDir, nodir: true }, (err, data) => {
        if (err) {
          debug('get /sourcethumbs - glob error', err);
          return next(err);
        }
        data = data.map(name => name.substring(0, name.indexOf('_')));
        // debug('get /sourcethumbs', { data });
        res.json(data);
      });
    })
    .post((req, res, next) => {
      const { id, sourceName } = req.body;
      // debug('post /sourcethumbs', { id, sourceName });
      const sourcePath = path.join(paths.base(config.dir_data), 'sources', sourceName);
      const thumbDir = path.join(paths.base(config.dir_data), 'thumbs');
      const thumbPath = path.join(thumbDir, `${id}_thumb.jpg`);
      thumbPromise(sourcePath, thumbPath)
        .then(() => {
          // debug('post /sourcethumbs', { thumbPath });
          res.json({ thumb: thumbPath });
        })
        .catch((error) => {
          debug('post /sourcethumbs - thumbPromise error', error);
          next(error);
        });
    });
}
