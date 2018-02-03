import {
  isTileImageDescriptor,
  isThumbnailImageDescriptor
} from '@lens/image-descriptors';
import captureContextPlugin from '../utils/captureContextPlugin';
import { processThumbnail } from './thumbnail';
import { processTile } from './tile';

export default (jobs) => {
  const capture = {};

  jobs.image = {
    plugins: [captureContextPlugin],
    pluginOptions: {
      captureContextPlugin: { capture }
    },
    perform: (job, cb) => {
      const { imageDescriptor } = job;
      const { context } = capture;

      if (isTileImageDescriptor(imageDescriptor)) {
        return processTile(context, job, cb);
      }

      if (isThumbnailImageDescriptor(imageDescriptor)) {
        return processThumbnail(context, job, cb);
      }

      context.respondWithError(new Error('unexpected image job'), job, cb);
    }
  };
};
