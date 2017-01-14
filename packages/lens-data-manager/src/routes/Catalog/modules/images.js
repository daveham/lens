import { createAction } from 'redux-actions';
import fetch from 'isomorphic-fetch';

import { makeImageId } from 'utils';

import debugLib from 'debug';
const debug = debugLib('app:module:images');

const REQUEST_IMAGE = 'REQUEST_IMAGE';
const CLEAR_REQUEST_IMAGE = 'CLEAR_REQUEST_IMAGE';
const RECEIVE_IMAGE = 'RECEIVE_IMAGE';

// action creators
const requestImageAction = createAction(REQUEST_IMAGE);
const clearRequestImageAction = createAction(CLEAR_REQUEST_IMAGE);
const receiveImageAction = createAction(RECEIVE_IMAGE);

// actions
export const ensureImage = (imageDescriptor, force) => {
  debug('ensureImage', { imageDescriptor, force });
  return (dispatch, getstate) => {
    const id = makeImageId(imageDescriptor);
    debug('ensureImage', { id });
    const image = getstate().images[id];
    const notNeeded = image && (image.loading || (image.url && !force));
    if (notNeeded) return;

    const body = JSON.stringify(imageDescriptor);
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    };
    dispatch(requestImageAction(imageDescriptor));
    debug('ensureImage: Invoking fetch', { body, headers });
    return fetch('/api/images/', { method: 'POST', body, headers })
      .then((response) => {
        if (response.status >= 400) {
          throw new Error('ensureImage: Bad response from server');
        }
        return response.json();
      }).then((data) => {
        if (data.url) {
          debug('ensureImage', { url: data.url });
          dispatch(receiveImageAction({ imageDescriptor, url: data.url }));
        } else if (data.task) {
          debug('ensureImage', { task: data.task });
        } else if (data.error) {
          debug('ensureImage', { error: data.error });
          throw new Error(data.error); // TODO: what value here?
        } else {
          throw new Error('ensureImage: Unexpected response from server');
        }
      })
      .catch(reason => {
        debug('ensureImage: Error', reason);
        dispatch(clearRequestImageAction(imageDescriptor));
      });
  };
};

export const actions = {
  ensureImage,
  receiveImage: receiveImageAction
};

// reducers
const imageReducer = (state = {}, url) => {
  // add the url to the image object and reset the loading flag
  return {
    ...state,
    url,
    loading: false
  };
};

const imageLoadingReducer = (state = {}, loading) => {
  // set the loading flag
  return {
    ...state,
    loading
  };
};

export default (state = {}, { type, payload }) => {
  switch (type) {
    case REQUEST_IMAGE: {
      // payload is the image descriptor; set the loading flag
      const id = makeImageId(payload);
      return {
        ...state,
        [id]: imageLoadingReducer(state[id], true)
      };
    }

    case CLEAR_REQUEST_IMAGE: {
      // payload is the image descriptor, reset the loading flag
      const id = makeImageId(payload);
      return {
        ...state,
        [id]: imageLoadingReducer(state[id], false)
      };
    }

    case RECEIVE_IMAGE: {
      const { imageDescriptor, url } = payload;
      const id = makeImageId(imageDescriptor);
      return {
        ...state,
        [id]: imageReducer(state[id], url)
      };
    }

    default:
      return state;
  }
};
