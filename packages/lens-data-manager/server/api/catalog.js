import { loadCatalog } from 'server/api/util';
const debug = require('debug')('srv:api-catalog');

export default function configureApi(router) {
  debug('conigure api get /catalog');
  router.get('/catalog', (req, res) => {
    loadCatalog((err, catalog) => {
      if (err) throw err;

      res.json(catalog);
    });
  });
}
