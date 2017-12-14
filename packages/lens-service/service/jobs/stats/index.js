import fs from 'fs';
import gm from 'gm';
import { sendResponse } from '../../worker';
import paths from '../../../config/paths';

import debugLib from 'debug';
const debug = debugLib('lens:jobs-stats');

const statPromise = target => {
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
      debug('file stats', { data });
      resolve(data);
    });
  });
};

const identifyPromise = target => {
  return new Promise((resolve, reject) => {
    gm(target).identify((err, gmdata) => {
      if (err) {
        debug('gm identify error', { err });
        return reject(new Error(err));
      }

      const data = {
        format: gmdata.Format,
        width: gmdata.size.width,
        height: gmdata.size.height,
        depth: gmdata.depth,
        resolution: gmdata.Resolution,
        filesize: gmdata.Filesize
      };
      debug('gm identify', { data });
      resolve(data);
    });
  });
};

export default (jobs) => {
  jobs.stats = {
    perform: (job, cb) => {
      debug('stats job', { job });
      const { input } = job.statsDescriptor.imageDescriptor;
      debug('determining input', { imageDescriptor: job.statsDescriptor.imageDescriptor });

      const file = job.sourceFilename || input.file;
      const sourceFile = paths.resolveSourcePath(file);
      debug(`Source file is '${sourceFile}'`);

      Promise.all([
        statPromise(sourceFile),
        identifyPromise(sourceFile)
      ])
      .then((results) => {
        debug('stats success', { results });
        sendResponse({
          ...job,
          data: {
            ...results[0],
            ...results[1]
          }
        });
        cb();
      })
      .catch(error => {
        debug('stats error', { error });
        sendResponse({
          ...job,
          error
        });
        cb();
      });
    }
  };
};
