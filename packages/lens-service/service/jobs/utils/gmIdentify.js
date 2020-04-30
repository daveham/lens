import gm from 'gm';

import getDebugLog from './debugLog';
const debug = getDebugLog('identify');

export default target => {
  return new Promise((resolve, reject) => {
    try {
      gm(target).identify((err, gmdata) => {
        if (err) {
          debug('gm identify error', { err });
          return reject(err);
        }

        const data = {
          format: gmdata.Format,
          width: gmdata.size.width,
          height: gmdata.size.height,
          depth: gmdata.depth,
          resolution: gmdata.Resolution,
          filesize: gmdata.Filesize,
        };
        resolve(data);
      });
    } catch (ex) {
      reject(ex);
    }
  });
};
