import gm from 'gm';

import getDebugLog from './debugLog';
const debug = getDebugLog('gmThumbnail');

export default (sourceFile, destFile) => {
  return new Promise((resolve, reject) => {
    try {
      gm(sourceFile)
        .thumbnail(null, 100)
        .write(destFile, error => {
          if (error) {
            debug('gm thumbnail error', { error });
            return reject(error);
          }

          resolve();
        });
    } catch (ex) {
      reject(ex);
    }
  });
};
