import co from 'co';
import { pathFromImageDescriptor, urlFromImageDescriptor } from '@lens/image-descriptors';
import paths from '../../../config/paths';
import loadCatalog from '../utils/loadCatalog';
import thumbnail from '../utils/gmThumbnail';
import { respond, respondWithError } from '../../../server/context';

function* generator(imageDescriptor) {
  const catalog = yield loadCatalog();
  const { file } = catalog[imageDescriptor.input.id];

  const sourceFile = paths.resolveSourcePath(file);
  const destFile = paths.resolveThumbnailPath(pathFromImageDescriptor(imageDescriptor));
  yield thumbnail(sourceFile, destFile);
  return urlFromImageDescriptor(imageDescriptor);
}

export function processThumbnail(job) {
  return co(generator(job.imageDescriptor))
    .then(url => {
      respond(job, { url });
    })
    .catch(error => {
      respondWithError(job, error);
    });
}
