import path from 'path';
import co from 'co';
import mkdirp from 'mkdirp';
import { pathFromImageDescriptor, urlFromImageDescriptor } from '@lens/image-descriptors';
import paths from '../../../config/paths';
import loadCatalog from '../utils/loadCatalog';
import crop from '../utils/gmCrop';
import { respond, respondWithError } from '../../../server/context';

export function* generator(imageDescriptor) {
  const catalog = yield loadCatalog();
  const { file } = catalog[imageDescriptor.input.id];

  const sourceFile = paths.resolveSourcePath(file);
  const destFile = paths.resolveThumbnailPath(pathFromImageDescriptor(imageDescriptor));
  const destPath = path.dirname(destFile);
  const {
    location: { x, y },
    size: { width, height },
  } = imageDescriptor.input;

  yield mkdirp(destPath);
  yield crop(sourceFile, destFile, width, height, x, y);
  return urlFromImageDescriptor(imageDescriptor);
}

export function processTile(job) {
  const { imageDescriptor } = job;

  return co(generator(imageDescriptor))
    .then(url => {
      respond(job, { url });
    })
    .catch(error => {
      respondWithError(job, error);
    });
}
