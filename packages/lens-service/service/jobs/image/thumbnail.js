import gm from 'gm';
import {
  pathFromImageDescriptor,
  urlFromImageDescriptor
} from '@lens/image-descriptors';
import { sendResponse } from '../../worker';

import paths from '../../../config/paths';

import debugLib from 'debug';
const debug = debugLib('lens:jobs-image-thumbnail');

export function processThumbnail(imageDescriptor, sourceFilename, job, cb) {
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
