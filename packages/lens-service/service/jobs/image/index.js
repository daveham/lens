import { isTileImageDescriptor, isThumbnailImageDescriptor } from '@lens/image-descriptors';
import { processThumbnail } from './thumbnail';
import { processTile } from './tile';
import { respondWithError } from '../../../server/context';

export default jobs => {
  jobs.image = {
    perform: async job => {
      const { imageDescriptor } = job;

      if (isTileImageDescriptor(imageDescriptor)) {
        return processTile(job);
      }

      if (isThumbnailImageDescriptor(imageDescriptor)) {
        return processThumbnail(job);
      }

      respondWithError(job, new Error('unexpected image job'));
    },
  };
};
