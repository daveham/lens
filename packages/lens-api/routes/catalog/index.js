import { loadCatalog } from '../utils';

import getDebugLog from '../debugLog';
const debug = getDebugLog('catalog');

const get = (req, res, next) => {
  loadCatalog((err, catalog) => {
    if (err) {
      debug('loadCatalog error', { err });
      res.send(err);
    } else {
      res.send(catalog);
    }
    next();
  });
};

export function addRoutes(server) {
  server.get('/catalog', get);
}
