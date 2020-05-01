import fs from 'fs';
import { pathFromImageDescriptor, urlFromImageDescriptor } from '@lens/image-descriptors';
import { createImage } from '@lens/data-jobs';
import { enqueueJob } from '../utils/index';

import getDebugLog from './debugLog';
const debug = getDebugLog('multiple');

export default function processMultipleImages(clientId, imageDescriptors, res, next) {
  debug('processMultipleImages', { count: imageDescriptors.length });
  const enqueuedImageDescriptors = [];
  const enqueuedStatus = [];
  const erroredImageDescriptors = [];
  const erroredErrors = [];
  const existingImageDescriptors = [];
  const existingUrls = [];
  let index = 0;

  function processItem(imageDescriptor) {
    const path = pathFromImageDescriptor(imageDescriptor);

    return new Promise(resolve => {
      fs.access(path, fs.constants.R_OK, err => {
        if (err) {
          if (err.code === 'ENOENT') {
            debug('file does not exist - creating task', path);
            enqueuedImageDescriptors.push(imageDescriptor);
            enqueueJob(createImage(clientId, imageDescriptor)).then(status => {
              enqueuedStatus.push(status);
              resolve();
            });
          } else {
            debug('file access error', err);
            erroredImageDescriptors.push(imageDescriptor);
            erroredErrors.push(err);
            resolve();
          }
        } else {
          existingImageDescriptors.push(imageDescriptor);
          existingUrls.push(urlFromImageDescriptor(imageDescriptor));
          resolve();
        }
      });
    });
  }

  function nextItem() {
    if (index < imageDescriptors.length) {
      return processItem(imageDescriptors[index++]).then(nextItem);
    }
    return Promise.resolve();
  }

  nextItem().then(() => {
    debug(`processed ${imageDescriptors.length} image descriptors`, {
      existing: existingImageDescriptors.length,
      enqueued: enqueuedImageDescriptors.length,
      errored: erroredImageDescriptors.length,
    });

    res.send({
      enqueuedImageDescriptors,
      enqueuedStatus,
      erroredImageDescriptors,
      erroredErrors,
      existingImageDescriptors,
      existingUrls,
    });
    next();
  });
}
