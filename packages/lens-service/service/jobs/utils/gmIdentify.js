import gm from 'gm';

import debugLib from 'debug';
const debug = debugLib('lens:job-utils-identify');

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
