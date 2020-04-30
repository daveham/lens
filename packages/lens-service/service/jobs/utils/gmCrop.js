import gm from 'gm';

import getDebugLog from './debugLog';
const debug = getDebugLog('gmCrop');

export default (source, dest, width, height, x, y) => {
  return new Promise((resolve, reject) => {
    try {
      gm(source)
        .crop(width, height, x, y)
        .write(dest, error => {
          if (error) {
            debug('gm crop error', { error });
            return reject(error);
          }

          resolve();
        });
    } catch (ex) {
      reject(ex);
    }
  });
};
