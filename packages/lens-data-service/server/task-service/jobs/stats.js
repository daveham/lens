import { reportResults } from './utils';

import debugLib from 'debug';
const debug = debugLib('svc:jobs-stats');

export default (jobs) => {
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
