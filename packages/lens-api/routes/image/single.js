import errors from 'restify-errors';
import fs from 'fs';
import {
  pathFromImageDescriptor,
  urlFromImageDescriptor
} from '@lens/image-descriptors';
import { createImage } from '@lens/data-jobs';
import { enqueueJob } from '../utils';

import _debug from 'debug';
const debug = _debug('lens:api-image-single');

export default function processSingleImage(clientId, imageDescriptor, res, next) {
  const path = pathFromImageDescriptor(imageDescriptor);
  debug('processSingleImage', path);

  fs.access(path, fs.constants.R_OK, (err) => {
    if (!err) {
      res.send({ url: urlFromImageDescriptor(imageDescriptor) });
      return next();
    }

    if (err.code !== 'ENOENT') {
      debug('file access error', err);
      res.send(new errors.InternalServerError(err, 'file access error'));
      return next();
    }

    debug('file does not exist - creating task');

    enqueueJob(createImage(clientId, imageDescriptor), (status) => {
      res.send(status);
      next();
    });
  });
}
