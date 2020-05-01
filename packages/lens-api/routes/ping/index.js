import { createPing } from '@lens/data-jobs';
import { enqueueJob } from '../utils/index';

import getDebugLog from '../debugLog';
const debug = getDebugLog('ping');

const post = (req, res, next) => {
  const { clientId } = req.body;
  debug('performing ping via job', clientId);

  enqueueJob(createPing(clientId)).then(status => {
    res.send(status);
    next();
  });
};

export function addRoutes(server) {
  server.post('/ping', post);
}
