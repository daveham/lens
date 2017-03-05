import { createAction } from 'redux-actions';
import fetch from 'isomorphic-fetch';

import { makeImageKey } from '@lens/image-descriptors';

import { ACTIONS } from '../constants';
import { listKeyFromImageDescriptor } from '../utils';

import debugLib from 'debug';
const debug = debugLib('app:module:catalog-images-actions');

const actionPayloadFromImageDescriptor = payload => {
  return {
    ...payload,
    listKey: listKeyFromImageDescriptor(payload.imageDescriptor)
  };
};

// action creators
const requestImageAction = createAction(ACTIONS.REQUEST_IMAGE, actionPayloadFromImageDescriptor);
export const clearRequestImageAction = createAction(ACTIONS.CLEAR_REQUEST_IMAGE, actionPayloadFromImageDescriptor);
export const receiveImageAction = createAction(ACTIONS.RECEIVE_IMAGE, actionPayloadFromImageDescriptor);

// actions
export const ensureImage = (imageDescriptor, force) => {
  return (dispatch, getstate) => {
    const listKey = listKeyFromImageDescriptor(imageDescriptor);
    const byIds = getstate().images.byIds[listKey] || {};
    const id = makeImageKey(imageDescriptor);
    const image = byIds[id];
    const notNeeded = image && (image.loading || (image.url && !force));
    if (notNeeded) return;

    const body = JSON.stringify(imageDescriptor);
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    };

    // mark image request in progress
    dispatch(requestImageAction({ imageDescriptor }));

    // invoke api to check/generate the file
    return fetch('/api/images/', { method: 'POST', body, headers })
      .then((response) => {
        if (response.status >= 400) {
          throw new Error('ensureImage: Bad response from server');
        }
        return response.json();
      }).then(({ url, jobId, error }) => {
        if (url) {
          // image already exists in file system
          debug('ensureImage - exists', { imageDescriptor, url });
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
        dispatch(clearRequestImageAction({ imageDescriptor }));
      });
  };
};

export const actions = {
  ensureImage,
  receiveImage: receiveImageAction
};
