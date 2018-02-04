import {
  isSourceStatsDescriptor,
  isTileStatsDescriptor,
  ANALYSIS
} from '@lens/image-descriptors';
import captureContextPlugin from '../utils/captureContextPlugin';
import { processSource } from './source';
import { processTile } from './tile';

export default (jobs) => {
  const capture = {};

  jobs.stats = {
    plugins: [captureContextPlugin],
    pluginOptions: {
      captureContextPlugin: { capture }
    },
    perform: (job, cb) => {
      const { statsDescriptor } = job;
      const { context } = capture;

      if (isSourceStatsDescriptor(statsDescriptor)) {
        if (statsDescriptor.analysis === ANALYSIS.IDENTIFY) {
          return processSource(context, job, cb);
        }
      }

      if (isTileStatsDescriptor(statsDescriptor)) {
        if (statsDescriptor.analysis === ANALYSIS.HISTOGRAM) {
          return processTile(context, job, cb);
        }
      }

      context.respondWithError(new Error('unexpected stats job'), job);
      cb();
    }
  };
};
