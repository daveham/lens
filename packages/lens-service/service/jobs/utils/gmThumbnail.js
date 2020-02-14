import gm from 'gm';

import debugLib from 'debug';
const debug = debugLib('lens:job-utils-thumbnail');

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
