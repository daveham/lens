import { createPing } from '@lens/data-jobs';
import { enqueueJob } from '../utils/index';

import _debug from 'debug';
const debug = _debug('lens:api-ping');

const post = (req, res, next) => {
  const { clientId } = req.body;
  debug('performing ping via job', clientId);

  enqueueJob(createPing(clientId), (status) => {
    res.send(status);
    next();
  });
};

export function addRoutes(server) {
  server.post('/ping', post);
}
