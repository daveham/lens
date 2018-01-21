import co from 'co';
import {
  pathFromImageDescriptor,
  urlFromImageDescriptor
} from '@lens/image-descriptors';
import paths from '../../../config/paths';
import { sendResponse } from '../../worker';
import { respondWithError } from '../utils';
import thumbnail from '../utils/gmThumbnail';

import debugLib from 'debug';
const debug = debugLib('lens:jobs-image-thumbnail');

function* generator(sourceFilename, imageDescriptor) {
  const file = sourceFilename || imageDescriptor.input.file;
  if (!file) {
    return Promise.reject(new Error('missing source filename'));
  }

  const sourceFile = paths.resolveSourcePath(file);
  const destFile = paths.resolveThumbnailPath(pathFromImageDescriptor(imageDescriptor));
  yield thumbnail(sourceFile, destFile);
  return urlFromImageDescriptor(imageDescriptor);
}

export function processThumbnail(job, cb) {
  const { imageDescriptor, sourceFilename } = job;

  co(generator(sourceFilename, imageDescriptor))
  .then((url) => {
    sendResponse({ ...job, url });
    cb();
  })
  .catch((error) => {
    debug('processThumbnail error', { error });
    return respondWithError(error, job, cb);
  });
}
