import { createAction } from 'redux-actions';
import { listKeyFromImageDescriptor } from './selectors';

export const ACTIONS = {
  IMAGE_ENSURE: 'IMAGE_ENSURE',
  IMAGE_LOADING: 'IMAGE_LOADING',
  IMAGE_NOT_LOADING: 'IMAGE_NOT_LOADING',
  IMAGE_LOADED: 'IMAGE_LOADED',

  IMAGES_ENSURE: 'IMAGES_ENSURE',
  IMAGES_LOADING: 'IMAGES_LOADING',
  IMAGES_NOT_LOADING: 'IMAGES_NOT_LOADING',
  IMAGES_LOADED: 'IMAGES_LOADED',
};

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

export const ensureImage = createAction(ACTIONS.IMAGE_ENSURE, actionPayloadFromImageDescriptor);
export const imageLoading = createAction(ACTIONS.IMAGE_LOADING, actionPayloadFromImageDescriptor);
export const imageNotLoading = createAction(ACTIONS.IMAGE_NOT_LOADING, actionPayloadFromImageDescriptor);
export const imageLoaded = createAction(ACTIONS.IMAGE_LOADED, actionPayloadFromImageDescriptor);

export const ensureImages = createAction(ACTIONS.IMAGES_ENSURE, actionPayloadFromFirstImageDescriptor);
export const imagesLoading = createAction(ACTIONS.IMAGES_LOADING, actionPayloadFromFirstImageDescriptor);
export const imagesNotLoading = createAction(ACTIONS.IMAGES_NOT_LOADING, actionPayloadFromFirstImageDescriptor);
export const imagesLoaded = createAction(ACTIONS.IMAGES_LOADED, actionPayloadFromFirstImageDescriptor);
