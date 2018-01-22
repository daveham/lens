import jst from 'jStat';

import debugLib from 'debug';
const debug = debugLib('lens:job-utils-tile-stats');

const jStat = jst.jStat;

function runStats(vector) {
  return new Promise((resolve, reject) => {
    try {
      const stat = jStat(vector);
      const data = {};

      stat.mean((val) => { data.mean = val; })
      .min((val) => data.min = val)
      .max((val) => data.max = val)
      .histogram(10, (val) => data.histogram = val)
      .mode((val) => data.mode = val)
      .coeffvar((val) => {
        data.coeffvar = val;
        resolve(data);
      });

    } catch(ex) {
      reject(ex);
    }
  });
}

export default (buffer) => {
  return new Promise((resolve, reject) => {
    try {
      const length = buffer.length / 3;
      const r = new Array(length);
      const g = new Array(length);
      const b = new Array(length);
      for (let i = 0, j = 0; j < length; i += 3, j += 1) {
        r[j] = buffer[i];
        g[j] = buffer[i + 1];
        b[j] = buffer[i + 2];
      }

      return Promise.all([
        runStats(r),
        runStats(g),
        runStats(b)
      ])
      .then((results) => {
        resolve({
          red: results[0],
          green: results[1],
          blue: results[2]
        });
      });
    } catch(ex) {
      debug('jstat error', { ex });
      reject(ex);
    }
  });
};
