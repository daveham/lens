import mkdirp from 'mkdirp';

import debugLib from 'debug';
const debug = debugLib('lens:job-utils-make-dir');

export default path => {
  return new Promise((resolve, reject) => {
    mkdirp(path, error => {
      if (error) {
        debug('mkdirp error', { error });
        return reject(error);
      }

      resolve();
    });
  });
};
