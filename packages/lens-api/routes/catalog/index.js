import { loadCatalog } from '../utils';

import _debug from 'debug';
const debug = _debug('lens:api-catalog');

export default {
  get: (req, res, next) => {
    loadCatalog((err, catalog) => {
      if (err) {
        debug('loadCatalog error', { err });
        res.send(err);
      } else {
        res.send(catalog);
      }
      next();
    });
  }
};
