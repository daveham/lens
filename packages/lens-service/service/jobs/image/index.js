import {
  isTileImageDescriptor,
  isThumbnailImageDescriptor
} from '@lens/image-descriptors';
import { sendResponse } from '../../worker';
import { processThumbnail } from './thumbnail';
import { processTile } from './tile';

export default (jobs) => {
  jobs.image = {
    perform: (job, cb) => {
      const { imageDescriptor, sourceFilename } = job;

      if (isTileImageDescriptor(imageDescriptor)) {
        return processTile(imageDescriptor, sourceFilename, job, cb);
      }

      if (isThumbnailImageDescriptor(imageDescriptor)) {
        return processThumbnail(imageDescriptor, sourceFilename, job, cb);
      }

      sendResponse({
        ...job,
        error: new Error('unexpected gm job')
      });
      cb();
    }
  };
};
