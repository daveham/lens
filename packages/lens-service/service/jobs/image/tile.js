import path from 'path';
import co from 'co';
import {
  pathFromImageDescriptor,
  urlFromImageDescriptor
} from '@lens/image-descriptors';
import paths from '../../../config/paths';
import { sendResponse } from '../../worker';
import { respondWithError } from '../utils';
import ensureDir from '../utils/dirMake';
import crop from '../utils/gmCrop';

import debugLib from 'debug';
const debug = debugLib('lens:jobs-image-tile');

function* generator(sourceFilename, imageDescriptor) {
  const file = sourceFilename || imageDescriptor.input.file;
  if (!file) {
    return Promise.reject(new Error('missing source filename'));
  }

  const sourceFile = paths.resolveSourcePath(file);
  const destFile = paths.resolveThumbnailPath(pathFromImageDescriptor(imageDescriptor));
  const destPath = path.dirname(destFile);
  const { location: { x, y }, size: { width, height } } = imageDescriptor.input;

  yield ensureDir(destPath);
  yield crop(sourceFile, destFile, width, height,x, y);
  return urlFromImageDescriptor(imageDescriptor);
}

export function processTile(job, cb) {
  const { sourceFilename, imageDescriptor } = job;

  co(generator(sourceFilename, imageDescriptor))
  .then((url) => {
    sendResponse({ ...job, url });
    cb();
  })
  .catch((error) => {
    debug('processTile error', { error });
    return respondWithError(error, job, cb);
  });
}
