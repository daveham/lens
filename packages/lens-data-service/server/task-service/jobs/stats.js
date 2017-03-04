const debug = require('debug')('svc:jobs-stats');
import { reportResults } from './utils';

const defineJob = (jobs) => {
  jobs.stats = {
    perform: (job, cb) => {
      const { jobId, timestamp } = job;
      debug('stats perform', { job, jobId, timestamp });
      debug(`I want to generate stats data for source with id ${job.sd.imageDescriptor.input.id} and file ${job.sd.imageDescriptor.input.file}`);

      const result = {
        data: { xyzzy: 1 }
      };
      reportResults(job, null, result, cb);
    }
  };
};

export default defineJob;
