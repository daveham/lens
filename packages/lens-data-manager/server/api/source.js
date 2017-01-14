import path from 'path';
import config from 'config';
import { loadSource, statPromise } from 'api/util';
const debug = require('debug')('app:api-source');

const paths = config.utils_paths;

export default function configureApi(router) {

  router.route('/source/thumb/:id')
  .get((req, res, next) => {
    const { id } = req.params;
    debug('get source/thumb/id', id);

    loadSource(id, (err, source) => {
      if (err) {
        debug('loadSource error', err);
        return next(err);
      }

      const thumbFilename = `${id}_thumb.jpg`;
      const thumbFile = path.join(paths.base(config.dir_data), 'public', source.file);
      statPromise(thumbFile)
      .then(res.send(thumbFilename))
      .catch(error => {
        debug('ignore thumb file error', error);
        res.send('');
      });
    });
  });
}
