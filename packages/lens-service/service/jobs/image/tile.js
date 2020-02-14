import path from 'path';
import co from 'co';
import { pathFromImageDescriptor, urlFromImageDescriptor } from '@lens/image-descriptors';
import paths from '../../../config/paths';
import loadCatalog from '../utils/loadCatalog';
import ensureDir from '../utils/dirMake';
import crop from '../utils/gmCrop';

export function* generator(imageDescriptor, context) {
  const catalog = yield loadCatalog(context);
  const { file } = catalog[imageDescriptor.input.id];

  const sourceFile = paths.resolveSourcePath(file);
  const destFile = paths.resolveThumbnailPath(pathFromImageDescriptor(imageDescriptor));
  const destPath = path.dirname(destFile);
  const {
    location: { x, y },
    size: { width, height },
  } = imageDescriptor.input;

  yield ensureDir(destPath);
  yield crop(sourceFile, destFile, width, height, x, y);
  return urlFromImageDescriptor(imageDescriptor);
}

export function processTile(context, job, cb) {
  const { imageDescriptor } = job;

  co(generator(imageDescriptor, context))
    .then(url => {
      context.respond({ ...job, url });
      cb();
    })
    .catch(error => {
      context.respondWithError(error, job);
      cb();
    });
}
