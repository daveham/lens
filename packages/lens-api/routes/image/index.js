import processSingleImage from './single';
import processMultipleImages from './multiple';

export default {
  post: ({ body: { clientId, imageDescriptor, imageDescriptors } }, res, next) => {
    if (imageDescriptor) {
      return processSingleImage(clientId, imageDescriptor, res, next);
    }
    return processMultipleImages(clientId, imageDescriptors, res, next);
  }
};
