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

  const put = (req, res, next) => {
    const { simulationId } = req.params;
    const changes = req.body;
    debug('put simulations', { simulationId, changes });
    dataManager.updateSimulation(simulationId, changes)
      .then(data => {
        res.send(data);
        next();
      })
      .catch(err => {
        debug('put simulations error', { err });
        res.send(err);
        next();
      });
  };

  server.get('/simulations/:sourceId', get);
  server.put('/simulations/:simulationId', put);
}
