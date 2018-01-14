import fs from 'fs';

import debugLib from 'debug';
const debug = debugLib('lens:file-stats');

export const fileStats = target => {
  return new Promise((resolve, reject) => {
    fs.stat(target, (err, stats) => {
      if (err) {
        debug('file stat error', { err });
        return reject(new Error(err));
      }

      if (!stats.isFile()) {
        debug('not a file', { target });
        return reject(new Error(`${target} is not a file`));
      }

      const data = {
        ctime: stats.ctime,
        size: stats.size
      };
      resolve(data);
    });
  });
};
