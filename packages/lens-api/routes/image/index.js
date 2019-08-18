import processSingleImage from './single';
import processMultipleImages from './multiple';

const post = ({ body: { clientId, imageDescriptor, imageDescriptors } }, res, next) => {
  if (imageDescriptor) {
    return processSingleImage(clientId, imageDescriptor, res, next);
  }
  return processMultipleImages(clientId, imageDescriptors, res, next);
};

export function addRoutes(server) {
  server.post('/image', post);
}
