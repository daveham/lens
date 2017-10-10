import fs from 'fs';
import { pathFromImageDescriptor, urlFromImageDescriptor } from '@lens/image-descriptors';
import { createImage } from '@lens/data-jobs';
import { enqueueJob } from '../utils/index';

import _debug from 'debug';
const debug = _debug('lens:api-image');

export default {
  post: (req, res, next) => {
    const { clientId, imageDescriptor } = req.body;
    debug('POST image', { clientId, imageDescriptor });
    const path = pathFromImageDescriptor(imageDescriptor);
    debug('POST image', { path });

    fs.access(path, fs.constants.R_OK, (err) => {
      if (err) {
        if (err.code === 'ENOENT') {
          debug('file does not exist - creating task');
          enqueueJob(createImage(clientId, imageDescriptor), (status) => {
            res.send(status);
            next();
          });
        } else {
          debug('file access error', err);
          res.send({ error: err });
          next();
        }
      } else {
        debug('file exists');
        res.send({ url: urlFromImageDescriptor(imageDescriptor) });
        next();
      }
    });
  }
};
