import _debug from 'debug';
const debug = _debug('lens:api-editor');

export function addRoutes(server, dataManager) {
  const get = (req, res, next) => {
    dataManager.getSimulationsForSource(req.params.sourceId)
      .then(data => {
        res.send(data);
        next();
      })
      .catch(err => {
        debug('get simulations error', { err });
        res.send(err);
        next();
      });
  };

  server.get('/simulations/:sourceId', get);
}
