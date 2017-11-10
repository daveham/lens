import { createAction } from 'redux-actions';

export const ACTIONS = {
  REQUEST_IMAGE: 'REQUEST_IMAGE',
  CLEAR_REQUEST_IMAGE: 'CLEAR_REQUEST_IMAGE',
  RECEIVE_IMAGE: 'RECEIVE_IMAGE',
};

export const IMAGE_LIST_KEYS = {
  DEFAULT: 'images',
  THUMBNAILS: 'thumbnails'
};

// action creators
export const listKeyFromImageDescriptor = imageDescriptor => {
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

export const requestImageAction = createAction(ACTIONS.REQUEST_IMAGE, actionPayloadFromImageDescriptor);
export const clearRequestImageAction = createAction(ACTIONS.CLEAR_REQUEST_IMAGE, actionPayloadFromImageDescriptor);
export const receiveImageAction = createAction(ACTIONS.RECEIVE_IMAGE, actionPayloadFromImageDescriptor);
