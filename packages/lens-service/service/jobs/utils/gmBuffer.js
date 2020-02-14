import gm from 'gm';

import debugLib from 'debug';
const debug = debugLib('lens:job-utils-buffer');

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
