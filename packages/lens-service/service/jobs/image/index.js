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

function processThumbnail(imageDescriptor, job, cb) {
  const sourceFile = paths.resolveSourcePath(imageDescriptor.input.file);
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

function processTile(imageDescriptor, job, cb) {
  debug('gm tile success');
  sendResponse({
    ...job,
    url: urlFromImageDescriptor(imageDescriptor)
  });
  cb();
}

export default (jobs) => {
  jobs.image = {
    perform: (job, cb) => {
      const { imageDescriptor } = job;

      switch(imageDescriptor.output.purpose) {
        case PURPOSE.THUMBNAIL:
          return processThumbnail(imageDescriptor, job, cb);
        case PURPOSE.TILE:
          return processTile(imageDescriptor, job, cb);
        default:
          sendResponse({
            ...job,
            error: new Error('unexpected gm job')
          });
      }
    }
  };
};
