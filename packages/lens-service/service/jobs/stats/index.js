import {
  isSourceStatsDescriptor,
  ANALYSIS
} from '@lens/image-descriptors';
import { respondWithError} from '../utils';
import { processSource } from './source';

export default (jobs) => {
  jobs.stats = {
    perform: (job, cb) => {
      const { statsDescriptor } = job;
      if (isSourceStatsDescriptor(statsDescriptor)) {
        if (statsDescriptor.analysis === ANALYSIS.IDENTIFY) {
          processSource(job, cb);
        }
      }

      respondWithError(new Error('unexpected stats job'), job, cb);
    }
  };
};
