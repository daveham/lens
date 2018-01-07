import path from 'path';
import mkdirp from 'mkdirp';
import gm from 'gm';
import {
  pathFromImageDescriptor,
  urlFromImageDescriptor,
  PURPOSE
} from '@lens/image-descriptors';
import { sendResponse } from '../../worker';

import paths from '../../../config/paths';

import debugLib from 'debug';
const debug = debugLib('lens:jobs-image');

function processThumbnail(imageDescriptor, sourceFilename, job, cb) {
  const file = sourceFilename || imageDescriptor.input.file;
  if (!file) {
    sendResponse({ ...job, error: new Error('missing source filename') });
    cb();
    return;
  }

  const sourceFile = paths.resolveSourcePath(file);
  const destFile = paths.resolveThumbnailPath(pathFromImageDescriptor(imageDescriptor));

  try {
    gm(sourceFile).thumb(100, 100, destFile, 80, (error) => {
      if (error) {
        debug('gm thumb error', { error });
        sendResponse({
          ...job,
          error
        });
      } else {
        sendResponse({
          ...job,
          url: urlFromImageDescriptor(imageDescriptor)
        });
      }
      cb();
    });
  } catch(err) {
    debug('gm thumb caught exception', { err });
    sendResponse({
      ...job,
      error: err
    });
    cb();
  }
}

function processTile(imageDescriptor, sourceFilename, job, cb) {
  const { input } = imageDescriptor;
  const file = sourceFilename || input.file;
  if (!file) {
    sendResponse({ ...job, error: new Error('missing source filename') });
    cb();
    return;
  }

  const sourceFile = paths.resolveSourcePath(file);
  const destFile = paths.resolveThumbnailPath(pathFromImageDescriptor(imageDescriptor));
  const destPath = path.dirname(destFile);
  const { x, y } = input.location;
  const { width, height } = input.size;

  mkdirp(destPath, (mkerr) => {
    if (mkerr) {
      debug('processTile mkdirp error', { mkerr });
      sendResponse({
        ...job,
        error: mkerr
      });
      cb();
    } else {
      try {
        gm(sourceFile).crop(width, height, x, y).write(destFile, (error) => {
          if (error) {
            debug('gm crop error', { error });
            sendResponse({
              ...job,
              error
            });
          } else {
            sendResponse({
              ...job,
              url: urlFromImageDescriptor(imageDescriptor)
            });
          }
          cb();
        });
      } catch(err) {
        debug('gm crop caught exception', { err });
        sendResponse({
          ...job,
          error: err
        });
        cb();
      }
    }
  });
}

export default (jobs) => {
  jobs.image = {
    perform: (job, cb) => {
      // debug('image perform', { job });
      const { imageDescriptor, sourceFilename } = job;

      switch(imageDescriptor.output.purpose) {
        case PURPOSE.THUMBNAIL:
          return processThumbnail(imageDescriptor, sourceFilename, job, cb);
        case PURPOSE.TILE:
          return processTile(imageDescriptor, sourceFilename, job, cb);
        default:
          sendResponse({
            ...job,
            error: new Error('unexpected gm job')
          });
          cb();
      }
    }
  };
};
