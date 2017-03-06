const debug = require('debug')('svc:jobs-stats');
import { reportResults } from './utils';

const defineJob = (jobs) => {
  jobs.stats = {
    perform: (job, cb) => {
      const { jobId, timestamp } = job;
      const { input } = job.statsDescriptor.imageDescriptor;
      debug('stats perform', { job, jobId, timestamp });
      debug(`I want to generate stats data for source with id ${input.id} and file ${input.file}`);

      const result = {
        data: { xyzzy: input.id }
      };
      reportResults(job, null, result, cb);
    }
  };
};

export default defineJob;
