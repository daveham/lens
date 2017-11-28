import { createAction } from 'redux-actions';
import { listKeyFromImageDescriptor } from './selectors';

export const ACTIONS = {
  IMAGE_ENSURE: 'IMAGE_ENSURE',
  IMAGE_LOADING: 'IMAGE_LOADING',
  IMAGE_NOT_LOADING: 'IMAGE_NOT_LOADING',
  IMAGE_LOADED: 'IMAGE_LOADED',
};

const actionPayloadFromImageDescriptor = payload => {
  return {
    ...payload,
    listKey: listKeyFromImageDescriptor(payload.imageDescriptor)
  };
};

export const ensureImage = createAction(ACTIONS.IMAGE_ENSURE, actionPayloadFromImageDescriptor);
export const imageLoading = createAction(ACTIONS.IMAGE_LOADING, actionPayloadFromImageDescriptor);
export const imageNotLoading = createAction(ACTIONS.IMAGE_NOT_LOADING, actionPayloadFromImageDescriptor);
export const imageLoaded = createAction(ACTIONS.IMAGE_LOADED, actionPayloadFromImageDescriptor);
