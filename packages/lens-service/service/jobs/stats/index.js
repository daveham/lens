import { isSourceStatsDescriptor, isTileStatsDescriptor, ANALYSIS } from '@lens/image-descriptors';
import { respondWithError } from '../../../server/context';
import { processSource } from './source';
import { processTile } from './tile';

export default jobs => {
  jobs.stats = {
    perform: async job => {
      const { statsDescriptor } = job;

      if (isSourceStatsDescriptor(statsDescriptor)) {
        if (statsDescriptor.analysis === ANALYSIS.IDENTIFY) {
          return processSource(job);
        }
      }

      if (isTileStatsDescriptor(statsDescriptor)) {
        if (statsDescriptor.analysis === ANALYSIS.HISTOGRAM) {
          return processTile(job);
        }
      }

      respondWithError(job, new Error('unexpected stats job'));
    },
  };
};
