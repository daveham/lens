import config from '../../../config';

import debugLib from 'debug';
const debug = debugLib('lens:service:keysRemove');

export default (redis, pattern) => {
  return new Promise((resolve, reject) => {
    let count = 0;
    const stream = redis.scanStream({ match: pattern, count: 100 });
    stream.on('data', keys => {
      if (keys.length) {
        count += keys.length;
        const pipeline = redis.pipeline();
        keys.forEach(key => {
          if (key.startsWith(config.keyPrefix)) {
            key = key.substring(5);
          }
          pipeline.del(key);
        });
        pipeline.exec(err => {
          if (err) {
            debug('error in pipeline.exec', err);
          }
        });
      }
    });
    stream.on('end', () => {
      debug('stream end', count);
      resolve({ count });
    });
    stream.on('error', err => {
      debug('scanStream error', err);
      reject(err);
    });
  });
};
