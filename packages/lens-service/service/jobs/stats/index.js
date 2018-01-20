import {
  isSourceStatsDescriptor,
  isTileStatsDescriptor,
  ANALYSIS
} from '@lens/image-descriptors';
import { respondWithError} from '../utils';
import { processSource } from './source';
import { processTile } from './tile';

export default (jobs) => {
  jobs.stats = {
    perform: (job, cb) => {
      const { statsDescriptor } = job;
      if (isSourceStatsDescriptor(statsDescriptor)) {
        if (statsDescriptor.analysis === ANALYSIS.IDENTIFY) {
          return processSource(job, cb);
        }
      }

      if (isTileStatsDescriptor(statsDescriptor)) {
        if (statsDescriptor.analysis === ANALYSIS.HISTOGRAM) {
          return processTile(job, cb);
        }
      }

      respondWithError(new Error('unexpected stats job'), job, cb);
    }
  };
};
