import fs from 'fs';
import {
  pathFromImageDescriptor,
  urlFromImageDescriptor
} from '@lens/image-descriptors';
import { createImage } from '@lens/data-jobs';
import { enqueueJob } from '../utils/index';
import { loadCatalog } from '../utils';

import _debug from 'debug';
const debug = _debug('lens:api-image');

function processSingleImage(clientId, imageDescriptor, res, next) {
  const path = pathFromImageDescriptor(imageDescriptor);
  debug('processSingleImage', { path });

  fs.access(path, fs.constants.R_OK, (err) => {
    if (err) {
      if (err.code === 'ENOENT') {
        debug('file does not exist - creating task');

        loadCatalog((err, catalog) => {
          if (err) {
            debug('processSingleImage loadCatalog error', { err });
            res.send(err);
            next();
          } else {
            const { id } = imageDescriptor.input;
            const foundSource = catalog.sources.find((source) => source.id === id);
            if (!foundSource) {
              debug(`processSingleImage did not find source with id ${id}`);
              res.send(new Error(`Did not find source with id ${id}`));
              return next();
            }

            enqueueJob(createImage(clientId, imageDescriptor, foundSource.file), (status) => {
              res.send(status);
              next();
            });
          }
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

function processMultipleImages(clientId, imageDescriptors, res, next) {
  // TODO: load catalog, add source file path to imageDescriptors

  const enqueuedImageDescriptors = [];
  const enqueuedStatus = [];
  const erroredImageDescriptors = [];
  const erroredErrors = [];
  const existingImageDescriptors = [];
  const existingUrls = [];
  let index = 0;

  function processItem(imageDescriptor) {
    const path = pathFromImageDescriptor(imageDescriptor);
    debug('POST image', { path });

    return new Promise((resolve) => {
      fs.access(path, fs.constants.R_OK, (err) => {
        if (err) {
          if (err.code === 'ENOENT') {
            debug('file does not exist - creating task');
            enqueuedImageDescriptors.push(imageDescriptor);
            enqueueJob(createImage(clientId, imageDescriptor), (status) => {
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
          debug('file exists');
          existingImageDescriptors.push(imageDescriptor);
          existingUrls.push(urlFromImageDescriptor(imageDescriptor));
          resolve();
        }
      });
    });
  }

  function nextItem() {
    if (index < imageDescriptors.length) {
      processItem(imageDescriptors[index++]).then(nextItem);
    }
  }
  nextItem();

  res.send({
    enqueuedImageDescriptors,
    enqueuedStatus,
    erroredImageDescriptors,
    erroredErrors,
    existingImageDescriptors,
    existingUrls
  });
  next();
}

export default {
  post: (req, res, next) => {
    const { clientId, imageDescriptor, imageDescriptors } = req.body;
    debug('POST image', { clientId, imageDescriptor, imageDescriptors });
    if (imageDescriptor) {
      return processSingleImage(clientId, imageDescriptor, res, next);
    } else {
      return processMultipleImages(clientId, imageDescriptors, res, next);
    }

  }
};
