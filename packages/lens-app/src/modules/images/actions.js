import { createActions } from 'redux-actions';
import { listKeyFromImageDescriptor } from './selectors';

const actionPayloadFromImageDescriptor = payload => {
  return {
    ...payload,
    listKey: listKeyFromImageDescriptor(payload.imageDescriptor)
  };
};

const actionPayloadFromFirstImageDescriptor = payload => {
  return {
    ...payload,
    listKey: listKeyFromImageDescriptor(payload.imageDescriptors[0])
  };
};

export const {
  ensureImage,
  imageLoading,
  imageNotLoading,
  imageLoaded,
  ensureImages,
  imagesLoading,
  imagesNotLoading,
  imagesLoaded,
} = createActions({
  ENSURE_IMAGE: actionPayloadFromImageDescriptor,
  IMAGE_LOADING: actionPayloadFromImageDescriptor,
  IMAGE_NOT_LOADING: actionPayloadFromImageDescriptor,
  IMAGE_LOADED: actionPayloadFromImageDescriptor,
  ENSURE_IMAGES: actionPayloadFromFirstImageDescriptor,
  IMAGES_LOADING: actionPayloadFromFirstImageDescriptor,
  IMAGES_NOT_LOADING: actionPayloadFromFirstImageDescriptor,
  IMAGES_LOADED: actionPayloadFromFirstImageDescriptor,
});
