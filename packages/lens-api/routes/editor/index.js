import _debug from 'debug';
const debug = _debug('lens:api-editor');

function filterDeleted(collection) {
  return collection.filter(i => !i.isDeleted);
}

export function addRoutes(server, dataManager) {
  const getSimulations = (req, res, next) => {
    dataManager
      .getSimulationsForSource(req.params.sourceId)
      .then(data => {
        res.send(
          filterDeleted(data).map(s => ({
            ...s,
            executions: filterDeleted(s.executions).map(e => ({
              ...e,
              renderings: filterDeleted(e.renderings),
            })),
          })),
        );
        next();
      })
      .catch(err => {
        debug('get simulations error', { err });
        res.send(err);
        next();
      });
  };

  const postSimulation = (req, res, next) => {
    const { simulation } = req.body;
    debug('post simulation', { simulation });
    dataManager
      .addSimulation(simulation)
      .then(data => {
        res.send(data);
        next();
      })
      .catch(err => {
        debug('post simulation error', { err });
        res.send(err);
        next();
      });
  };

  const putSimulation = (req, res, next) => {
    const { simulationId } = req.params;
    const { changes } = req.body;
    debug('put simulations', { simulationId, changes });
    dataManager
      .updateSimulation(simulationId, changes)
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

  const postExecution = (req, res, next) => {
    const { execution } = req.body;
    debug('post execution', { execution });
    dataManager
      .addExecution(execution)
      .then(data => {
        res.send(data);
        next();
      })
      .catch(err => {
        debug('post execution error', { err });
        res.send(err);
        next();
      });
  };

  const putExecution = (req, res, next) => {
    const { executionId } = req.params;
    const { changes } = req.body;
    debug('put executions', { executionId, changes });
    dataManager
      .updateExecution(executionId, changes)
      .then(data => {
        res.send(data);
        next();
      })
      .catch(err => {
        debug('put executions error', { err });
        res.send(err);
        next();
      });
  };

  const postRendering = (req, res, next) => {
    const { rendering } = req.body;
    debug('post rendering', { rendering });
    dataManager
      .addRendering(rendering)
      .then(data => {
        res.send(data);
        next();
      })
      .catch(err => {
        debug('post rendering error', { err });
        res.send(err);
        next();
      });
  };

  const putRendering = (req, res, next) => {
    const { renderingId } = req.params;
    const { changes } = req.body;
    debug('put renderings', { renderingId, changes });
    dataManager
      .updateRendering(renderingId, changes)
      .then(data => {
        res.send(data);
        next();
      })
      .catch(err => {
        debug('put renderings error', { err });
        res.send(err);
        next();
      });
  };

  server.get('/simulations/:sourceId', getSimulations);
  server.put('/simulations/:simulationId', putSimulation);
  server.post('/simulations', postSimulation);
  server.put('/executions/:executionId', putExecution);
  server.post('/executions', postExecution);
  server.put('/renderings/:renderingId', putRendering);
  server.post('/renderings', postRendering);
}
