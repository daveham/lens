import gm from 'gm';

import debugLib from 'debug';
const debug = debugLib('lens:job-utils-thumbnail');

export default (sourceFile, destFile) => {
  return new Promise((resolve, reject) => {
    try {
      gm(sourceFile).thumb(100, 100, destFile, 80, (error) => {
        if (error) {
          debug('gm thumb error', { error });
          return reject(error);
        }

        resolve();
      });
    } catch(ex) {
      reject(ex);
    }
  });
};
