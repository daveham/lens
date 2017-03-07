import gm from 'gm';
import config from 'config';
import { pathFromImageDescriptor, urlFromImageDescriptor } from '@lens/image-descriptors';
import { reportResults } from '../utils';

import debugLib from 'debug';
const debug = debugLib('svc:jobs-image');

export default (jobs) => {
  jobs.image = {
    perform: (job, cb) => {
      const { jobId, timestamp, imageDescriptor } = job;
      debug('thumbnail perform', { job, jobId, timestamp });

      const sourceFile = config.utils_paths.sources(imageDescriptor.input.file);
      const destFile = config.utils_paths.thumbs(pathFromImageDescriptor(imageDescriptor));

      gm(sourceFile).thumb(100, 100, destFile, 80, (err, gmdata) => {
        let result;
        if (!err) {
          debug('gm thumb success', { gmdata });
          result = {
            url: urlFromImageDescriptor(imageDescriptor)
          };
        }
        reportResults(job, err, result, cb);
      });
    }
  };
};
