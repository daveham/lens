import gm from 'gm';

import getDebugLog from './debugLog';
const debug = getDebugLog('gmBuffer');

export default source => {
  return new Promise((resolve, reject) => {
    try {
      // MPC
      gm(source).toBuffer('RGB', (error, buffer) => {
        if (error) {
          debug('gm buffer error', { error });
          return reject(error);
        }

        resolve(buffer);
      });
    } catch (ex) {
      reject(ex);
    }
  });
};
