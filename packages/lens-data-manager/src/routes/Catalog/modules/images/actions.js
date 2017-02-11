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
  return (dispatch, getstate) => {
    const id = makeImageId(imageDescriptor);
    const image = getstate().images[id];
    const notNeeded = image && (image.loading || (image.url && !force));
    debug('ensureImage', { imageDescriptor, id, force, notNeeded });
    if (notNeeded) return;

    const body = JSON.stringify(imageDescriptor);
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    };

    // mark image request in progress
    dispatch(requestImageAction(imageDescriptor));

    // invoke api to check/generate the file
    debug('ensureImage: Invoking fetch', { body, headers });
    return fetch('/api/images/', { method: 'POST', body, headers })
      .then((response) => {
        if (response.status >= 400) {
          throw new Error('ensureImage: Bad response from server');
        }
        return response.json();
      }).then(({ url, jobId, error }) => {
        if (url) {
          // image already exists in file system
          debug('ensureImage - exists', { url });
          dispatch(receiveImageAction({ imageDescriptor, url }));
        } else if (jobId) {
          // task has been enqueued to generate the image
          debug('ensureImage - job enqueued', { jobId });
        } else if (error) {
          // server encountered an error
          debug('ensureImage - server error', { error });
          throw new Error(error); // TODO: what value here?
        } else {
          throw new Error('ensureImage: Unexpected response from server');
        }
      })
      .catch(reason => {
        // request failed, clear the 'in progress' state for image
        debug('ensureImage: Error', reason);
        dispatch(clearRequestImageAction(imageDescriptor));
      });
  };
};

export const actions = {
  ensureImage,
  receiveImage: receiveImageAction
};
