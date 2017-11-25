import { createAction } from 'redux-actions';
import { IMAGE_LIST_KEYS } from './selectors';
// import debugLib from 'debug';
// const debug = debugLib('lens:modules:images:actions');

export const ACTIONS = {
  IMAGE_ENSURE: 'IMAGE_ENSURE',
  IMAGE_LOADING: 'IMAGE_LOADING',
  IMAGE_NOT_LOADING: 'IMAGE_NOT_LOADING',
  IMAGE_LOADED: 'IMAGE_LOADED',
};

// action creators
export const listKeyFromImageDescriptor = imageDescriptor => {
  // debug('listKeyFromImageDescriptor', imageDescriptor);
  if (imageDescriptor && imageDescriptor.output && imageDescriptor.output.purpose === 't') {
    return IMAGE_LIST_KEYS.THUMBNAILS;
  }
  return IMAGE_LIST_KEYS.DEFAULT;
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
