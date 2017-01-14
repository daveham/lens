import gm from 'gm';

const debug = require('debug')('app:api-gm-util');

export const identifyPromise = graphicsFile => {
  return new Promise((resolve, reject) => {
    gm(graphicsFile).identify((err, gmdata) => {
      if (err) {
        debug('gm service error, gm identify', err);
        return reject(new Error(err));
      }
      // debug('gm identify', gmdata);
      resolve(gmdata);
    });
  });
};

export const thumbPromise = (graphicsFile, thumbFile) => {
  return new Promise((resolve, reject) => {
    // debug('thumb', graphicsFile, thumbFile);
    gm(graphicsFile).thumb(100, 100, thumbFile, 80, (err, gmdata) => {
      if (err) {
        debug('gm service error, gm resize', err);
        return reject(new Error(err));
      }
      // debug('gm resize', gmdata);
      resolve(gmdata);
    });
  });
};
