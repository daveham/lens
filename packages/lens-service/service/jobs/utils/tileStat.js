import jst from 'jStat';
import chroma from 'chroma-js';

import getDebugLog from './debugLog';
const debug = getDebugLog('tileStat');

const jStat = jst.jStat;

function makeRelativeChannel(primary, a, b) {
  const length = primary.length;
  const data = new Array(length);
  for (let i = 0; i < length; i++) {
    data[i] = Math.floor(Math.max(0, primary[i] - (a[i] + b[i]) / 3));
  }
  return data;
}

function absoluteHistogram(vector, maxValue, includeZero = true, binCount = 10) {
  const binWidth = maxValue / binCount;
  const binLast = binCount - 1;
  const len = vector.length;
  const bins = [];

  for (let i = 0; i < binCount; i++) {
    bins[i] = 0;
  }

  let v;
  for (let i = 0; i < len; i++) {
    v = vector[i];
    if (v || includeZero) {
      bins[Math.min(Math.floor(vector[i] / binWidth), binLast)] += 1;
    }
  }

  return bins;
}

function runStats(vector, maxValue, includeZero = true) {
  return new Promise((resolve, reject) => {
    try {
      const stat = jStat(vector);
      const data = {
        histogram: absoluteHistogram(vector, maxValue, includeZero),
      };

      stat
        .mean(val => {
          data.mean = val;
        })
        .min(val => (data.min = val))
        .max(val => (data.max = val))
        .mode(val => (data.mode = val))
        .coeffvar(val => {
          data.coeffvar = val;
          resolve(data);
        });
    } catch (ex) {
      reject(ex);
    }
  });
}

export default buffer => {
  return new Promise((resolve, reject) => {
    try {
      const length = buffer.length / 3;
      const r = new Array(length);
      const g = new Array(length);
      const b = new Array(length);
      const h = new Array(length);
      const s = new Array(length);
      const l = new Array(length);
      let hsl;
      for (let i = 0, j = 0; j < length; i += 3, j += 1) {
        r[j] = buffer[i];
        g[j] = buffer[i + 1];
        b[j] = buffer[i + 2];

        hsl = chroma(r[j], g[j], b[j]).hsl();
        h[j] = hsl[0];
        s[j] = hsl[1];
        l[j] = hsl[2];
      }

      return Promise.all([
        runStats(makeRelativeChannel(r, g, b), 256, false),
        runStats(makeRelativeChannel(g, b, r), 256, false),
        runStats(makeRelativeChannel(b, r, g), 256, false),
        runStats(h, 360),
        runStats(s, 1),
        runStats(l, 1),
      ]).then(results => {
        resolve({
          red: results[0],
          green: results[1],
          blue: results[2],
          hue: results[3],
          saturation: results[4],
          luminance: results[5],
        });
      });
    } catch (ex) {
      debug('jstat error', { ex });
      reject(ex);
    }
  });
};
