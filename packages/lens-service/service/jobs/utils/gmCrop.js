import gm from 'gm';

import debugLib from 'debug';
const debug = debugLib('lens:job-utils-crop');

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
