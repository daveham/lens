import { createStats } from '@lens/data-jobs';
import { enqueueJob } from '../utils';

import _debug from 'debug';
const debug = _debug('lens:api-stats-source');

export function requestSourceStats(clientId, statsDescriptor, statsKey, res, next) {
  return enqueueJob(createStats(clientId, statsDescriptor)).then(status => {
    debug('createStats - enqueueJob', { status });
    res.send({ status: 'pending' });
    next();
  });
}
