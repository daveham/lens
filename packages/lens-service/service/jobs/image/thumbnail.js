import co from 'co';
import {
  pathFromImageDescriptor,
  urlFromImageDescriptor
} from '@lens/image-descriptors';
import paths from '../../../config/paths';
import loadCatalog from '../utils/loadCatalog';
import thumbnail from '../utils/gmThumbnail';

function* generator(imageDescriptor, context) {
  const catalog = yield loadCatalog(context);
  const { file } = catalog[imageDescriptor.input.id];

  const sourceFile = paths.resolveSourcePath(file);
  const destFile = paths.resolveThumbnailPath(pathFromImageDescriptor(imageDescriptor));
  yield thumbnail(sourceFile, destFile);
  return urlFromImageDescriptor(imageDescriptor);
}

export function processThumbnail(context, job, cb) {
  co(generator(job.imageDescriptor, context))
  .then((url) => {
    context.respond({ ...job, url });
    cb();
  })
  .catch((error) => {
    context.respondWithError(error, job);
    cb();
  });
}
