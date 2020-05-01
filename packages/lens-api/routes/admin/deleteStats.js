import { deleteStats } from '@lens/data-jobs';
import { enqueueJob } from '../utils/index';

import getDebugLog from '../debugLog';
const debug = getDebugLog('admin:deleteStats');

const post = (req, res, next) => {
  const { clientId, sourceId, group } = req.body;
  debug('enqueing delete keys', clientId, sourceId, group);

  enqueueJob(deleteStats(clientId, sourceId, group)).then(status => {
    res.send(status);
    next();
  });
};

export function addRoutes(server) {
  server.post('/deleteStats', post);
}
