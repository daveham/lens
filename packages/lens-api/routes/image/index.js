import { createImage } from '@lens/data-jobs';
import { enqueueJob } from '../utils/index';

import _debug from 'debug';
const debug = _debug('lens:api-image');

export default {
  post: (req, res, next) => {
    const { clientId, imageDescriptor } = req.body;
    debug('image request ', clientId, imageDescriptor);

    enqueueJob(createImage(clientId, imageDescriptor), (status) => {
      res.send(status);
      next();
    });
  }
};
