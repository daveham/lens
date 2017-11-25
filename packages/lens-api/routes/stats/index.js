import { createStats } from '@lens/data-jobs';
import { enqueueJob } from '../utils/index';

import _debug from 'debug';
const debug = _debug('lens:api-stats');

export default {
  post: (req, res, next) => {
    const { clientId, statsDescriptor } = req.body;
    debug('POST stats', { clientId, statsDescriptor });

    enqueueJob(createStats(clientId, statsDescriptor), (status) => {
      res.send(status);
      next();
    });
  }
};
