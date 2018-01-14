import fs from 'fs';
import {
  pathFromImageDescriptor,
  urlFromImageDescriptor
} from '@lens/image-descriptors';
import { createImage } from '@lens/data-jobs';
import { enqueueJob } from '../utils/index';
import { loadCatalog } from '../utils';

import _debug from 'debug';
const debug = _debug('lens:api-image-multiple');

export default function processMultipleImages(clientId, imageDescriptors, res, next) {
  debug('processMultipleImages', { count: imageDescriptors.length });
  const enqueuedImageDescriptors = [];
  const enqueuedStatus = [];
  const erroredImageDescriptors = [];
  const erroredErrors = [];
  const existingImageDescriptors = [];
  const existingUrls = [];
  let index = 0;
  let sourceFileMap = {};

  function processItem(imageDescriptor) {
    const path = pathFromImageDescriptor(imageDescriptor);

    return new Promise((resolve) => {
      fs.access(path, fs.constants.R_OK, (err) => {
        if (err) {
          if (err.code === 'ENOENT') {
            debug('file does not exist - creating task', path);
            enqueuedImageDescriptors.push(imageDescriptor);
            const sourceFile = sourceFileMap[imageDescriptor.input.id];
            if (sourceFile) {
              enqueueJob(createImage(clientId, imageDescriptor, sourceFile), (status) => {
                enqueuedStatus.push(status);
                resolve();
              });
            } else {
              const missingError = new Error(`Source file not found for id ${imageDescriptor.input.id}`);
              debug('processMultipleItems', missingError);
              erroredImageDescriptors.push(imageDescriptor);
              erroredErrors.push(missingError);
              resolve();
            }
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

  loadCatalog((err, catalog) => {
    if (err) {
      debug('processMultipleImage loadCatalog error', { err });
      res.send(err);
      next();
    } else {
      // turn sources into a map to be used from within processItem
      catalog.sources.forEach((source) => {
        sourceFileMap[source.id] = source.file;
      });

      nextItem().then(() => {
        debug(`processed ${imageDescriptors.length} image descriptors`, {
          existing: existingImageDescriptors.length,
          enqueued: enqueuedImageDescriptors.length,
          errored: erroredImageDescriptors.length
        });

        res.send({
          enqueuedImageDescriptors,
          enqueuedStatus,
          erroredImageDescriptors,
          erroredErrors,
          existingImageDescriptors,
          existingUrls
        });
        next();
      });
    }
  });
}
