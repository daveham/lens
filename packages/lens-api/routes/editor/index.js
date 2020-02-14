import path from 'path';
import fs from 'fs';
import _debug from 'debug';
const debug = _debug('lens:api-editor');

const dataFolder = process.env.LENS_DATA || '/data';
const hikesFolder = path.join(dataFolder, 'db');

function hikesFilename(sourceId, simulationId) {
  return path.join(hikesFolder, `hikes-${sourceId}-${simulationId}.json`);
}

function filterDeleted(collection) {
  return collection ? collection.filter(i => !i.isDeleted) : [];
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
        next(err);
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
        next(err);
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
        next(err);
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
        next(err);
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
        next(err);
      });
  };

  const readHikes = (sourceId, simulationId) => {
    debug('read hikes', { sourceId, simulationId });
    return new Promise((resolve, reject) => {
      try {
        const filename = hikesFilename(sourceId, simulationId);
        fs.readFile(filename, 'utf8', (err, data) => {
          if (err) {
            debug('readHikes:fs.readFile err', { err });
            return reject(err);
          }
          const hikes = JSON.parse(data);
          resolve(hikes);
        });
      } catch (error) {
        debug('getHikes - exception', { error });
        reject(error);
      }
    });
  };

  const postRunExecution = (req, res, next) => {
    const { clientId, sourceId, simulationId, executionId } = req.body;
    debug('post run execution', { clientId, sourceId, simulationId, executionId });

    Promise.all([
      dataManager.getSimulation(simulationId, false),
      dataManager.getExecution(executionId, false),
      readHikes(sourceId, simulationId),
    ])
      .then(data => {
        res.send({
          clientId,
          simulation: data[0],
          execution: data[1],
          hikes: data[2],
        });
        next();
      })
      .catch(err => {
        debug('post run execution error', { err });
        next(err);
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
        next(err);
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
        next(err);
      });
  };

  const getHikes = (req, res, next) => {
    const { sourceId, simulationId } = req.params;
    debug('get hikes', { sourceId, simulationId });
    try {
      const filename = hikesFilename(sourceId, simulationId);
      fs.readFile(filename, 'utf8', (err, data) => {
        if (err) {
          debug('getHikes:fs.readFile err', { err });
          res.send([]);
          return next();
        }
        const hikes = JSON.parse(data);
        res.send(hikes);
        next();
      });
    } catch (error) {
      debug('getHikes - exception', { error });
      next(error);
    }
  };

  const postHikes = (req, res, next) => {
    const { sourceId, simulationId } = req.params;
    const { hikes } = req.body;
    debug('post hikes', { sourceId, simulationId });
    try {
      const filename = hikesFilename(sourceId, simulationId);
      const data = JSON.stringify(
        filterDeleted(hikes).map(({ isNew: ignoredIsNew, ...hProps }) => ({
          ...hProps,
          trails: filterDeleted(hProps.trails).map(({ isNew: ignoredIsNew, ...tProps }) => ({
            ...tProps,
            hikers: filterDeleted(tProps.hikers).map(({ isNew: ignoredIsNew, ...kProps }) => ({
              ...kProps,
            })),
          })),
        })),
      );
      fs.writeFile(filename, data, 'utf8', err => {
        if (err) {
          debug('postHikes:fs.writeFile err', { err });
          return next(err);
        }
        res.send(200);
        next();
      });
    } catch (error) {
      debug('postHikes - exception', { error });
      next(error);
    }
  };

  server.get('/simulations/:sourceId', getSimulations);
  server.put('/simulations/:simulationId', putSimulation);
  server.post('/simulations', postSimulation);

  server.put('/executions/:executionId', putExecution);
  server.post('/executions/:executionId/run', postRunExecution);
  server.post('/executions', postExecution);

  server.put('/renderings/:renderingId', putRendering);
  server.post('/renderings', postRendering);

  server.get('/hikes/:sourceId/:simulationId', getHikes);
  server.post('/hikes/:sourceId/:simulationId', postHikes);
}
