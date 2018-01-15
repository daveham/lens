import {
  isTileImageDescriptor,
  isThumbnailImageDescriptor
} from '@lens/image-descriptors';
import { processThumbnail } from './thumbnail';
import { processTile } from './tile';
import { respondWithError} from '../utils';

export default (jobs) => {
  jobs.image = {
    perform: (job, cb) => {
      const { imageDescriptor } = job;

      if (isTileImageDescriptor(imageDescriptor)) {
        return processTile(job, cb);
      }

      if (isThumbnailImageDescriptor(imageDescriptor)) {
        return processThumbnail(job, cb);
      }

      respondWithError(new Error('unexpected image job'), job, cb);
    }
  };
};
