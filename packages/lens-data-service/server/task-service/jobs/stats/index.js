import fs from 'fs';
import gm from 'gm';
import config from 'config';
import { reportResults } from '../utils';

import debugLib from 'debug';
const debug = debugLib('svc:jobs-stats');

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
      const { jobId, timestamp } = job;
      const { input } = job.statsDescriptor.imageDescriptor;
      debug('stats perform', { job, jobId, timestamp });
      debug(`I want to generate stats data for source with id ${input.id} and file ${input.file}`);

      const sourceFile = config.utils_paths.sources(input.file);
      debug(`Source file is '${sourceFile}'`);

      const result = {};
      Promise.all([
        statPromise(sourceFile),
        identifyPromise(sourceFile)
      ])
      .then((data) => {
        result.data = {
          ...data[0],
          ...data[1]
        };
        reportResults(job, null, result, cb);
      })
      .catch(error => {
        reportResults(job, error, result, cb);
      });
    }
  };
};
