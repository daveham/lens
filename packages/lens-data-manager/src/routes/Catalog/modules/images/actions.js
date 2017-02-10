import { makeImageId } from '@lens/image-descriptors';
import { ACTIONS } from './constants';

import { createAction } from 'redux-actions';
import fetch from 'isomorphic-fetch';

import debugLib from 'debug';
const debug = debugLib('app:module:images-acitons');

// action creators
const requestImageAction = createAction(ACTIONS.REQUEST_IMAGE);
const clearRequestImageAction = createAction(ACTIONS.CLEAR_REQUEST_IMAGE);
const receiveImageAction = createAction(ACTIONS.RECEIVE_IMAGE);

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
