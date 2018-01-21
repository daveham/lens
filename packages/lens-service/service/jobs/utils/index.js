import { sendResponse } from '../../worker';
import debugLib from 'debug';
const debug = debugLib('lens:jobs-utils');

export function respondWithError(error, job, cb) {
  debug('respondWithError', { error });
  sendResponse({
    ...job,
    error
  });
  cb();
}
