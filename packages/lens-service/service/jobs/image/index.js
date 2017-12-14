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
  debug('processThumbnail', { sourceFilename });

  const file = sourceFilename || imageDescriptor.input.file;
  if (!file) {
    return sendResponse({ ...job, error: new Error('missing source filename') });
  }

  const sourceFile = paths.resolveSourcePath(file);
  const destFile = paths.resolveThumbnailPath(pathFromImageDescriptor(imageDescriptor));
  debug('thumbnail perform', { sourceFile, destFile });
  gm(sourceFile).thumb(100, 100, destFile, 80, (error, gmdata) => {
    if (error) {
      debug('gm thumb error', { gmdata });
      sendResponse({
        ...job,
        error
      });
    } else {
      debug('gm thumb success', { gmdata });
      sendResponse({
        ...job,
        url: urlFromImageDescriptor(imageDescriptor)
      });
    }
    cb();
  });
}

function processTile(imageDescriptor, sourceFilename, job, cb) {
  debug('gm tile success');

  // gm convert -crop 100x100+1024+1024 Ruins.tif crop_1024_1024.png
  // gm(sourcefile).crop(100, 100, 1024, 1024).write(destFile, (err) => {});

  sendResponse({
    ...job,
    url: urlFromImageDescriptor(imageDescriptor)
  });
  cb();
}

export default (jobs) => {
  jobs.image = {
    perform: (job, cb) => {
      debug('image perform', { job });
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
      }
    }
  };
};
