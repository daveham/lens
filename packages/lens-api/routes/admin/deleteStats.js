import { deleteStats } from '@lens/data-jobs';
import { enqueueJob } from '../utils/index';

import _debug from 'debug';
const debug = _debug('lens:api-deleteStats');

export default {
  post: (req, res, next) => {
    const { clientId, sourceId, group } = req.body;
    debug('enqueing delete keys', clientId, sourceId, group);

    enqueueJob(deleteStats(clientId, sourceId, group), (status) => {
      res.send(status);
      next();
    });
  }
};