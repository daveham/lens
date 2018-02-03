import errors from 'restify-errors';
import { createStats } from '@lens/data-jobs';
import { loadCatalog, enqueueJob } from '../utils';

import _debug from 'debug';
const debug = _debug('lens:api-stats-source');

export function requestTileStats(clientId, statsDescriptor, statsKey, res, next) {
  return loadCatalog((err, catalog) => {
    if (err) {
      debug('requestTileStats', { err });
      const payload = {
        status: 'bad',
        error: new errors.InternalServerError(err, 'load catalog')
      };
      res.send(payload);
      return next();
    }

    const { id } = statsDescriptor.imageDescriptor.input;
    const foundSource = catalog.sources.find((source) => source.id === id);
    if (!foundSource) {
      debug('requestTileStats - source not found', { id });
      const payload = {
        status: 'bad',
        error: new errors.ResourceNotFoundError({ message: `Did not find source with id ${id}` })
      };
      res.send(payload);
      return next();
    }

    return enqueueJob(createStats(clientId, statsDescriptor, foundSource.file), (status) => {
      debug('createStats - enqueueJob', { status });
      res.send({ status: 'pending' });
      next();
    });
  });
}
