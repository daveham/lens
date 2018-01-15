import gm from 'gm';
import {
  pathFromImageDescriptor,
  urlFromImageDescriptor
} from '@lens/image-descriptors';
import { sendResponse } from '../../worker';
import { respondWithError } from '../utils';
import paths from '../../../config/paths';

export function processThumbnail(job, cb) {
  const { imageDescriptor, sourceFilename } = job;
  const file = sourceFilename || imageDescriptor.input.file;
  if (!file) {
    return respondWithError(new Error('missing source filename'), job, cb);
  }

  const sourceFile = paths.resolveSourcePath(file);
  const destFile = paths.resolveThumbnailPath(pathFromImageDescriptor(imageDescriptor));

  try {
    gm(sourceFile).thumb(100, 100, destFile, 80, (error) => {
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
}
