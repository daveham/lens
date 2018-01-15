import path from 'path';
import mkdirp from 'mkdirp';
import gm from 'gm';
import {
  pathFromImageDescriptor,
  urlFromImageDescriptor
} from '@lens/image-descriptors';
import paths from '../../../config/paths';
import { sendResponse } from '../../worker';
import { respondWithError } from '../utils';

export function processTile(job, cb) {
  const { imageDescriptor, sourceFilename } = job;
  const file = sourceFilename || imageDescriptor.input.file;
  if (!file) {
    return respondWithError(new Error('missing source filename'), job, cb);
  }

  const sourceFile = paths.resolveSourcePath(file);
  const destFile = paths.resolveThumbnailPath(pathFromImageDescriptor(imageDescriptor));
  const destPath = path.dirname(destFile);
  const { location: { x, y }, size: { width, height } } = imageDescriptor.input;

  mkdirp(destPath, (mkerr) => {
    if (mkerr) {
      return respondWithError(mkerr, job, cb);
    }

    try {
      gm(sourceFile).crop(width, height, x, y).write(destFile, (error) => {
        if (error) {
          return respondWithError(error, job, cb);
        }

        sendResponse({
          ...job,
          url: urlFromImageDescriptor(imageDescriptor)
        });
        cb();
      });
    } catch(err) {
      respondWithError(err, job, cb);
    }
  });
}
