//import { combineReducers } from 'redux';

import { makeImageKey } from '@lens/image-descriptors';
import {
  listKeyFromImageDescriptor,
  requestImageAction,
  clearRequestImageAction,
  receiveImageAction
} from './actions';

import _debug from 'debug';
const debug = _debug('app:catalogimages');


// TODO: convert this thunk implementation into a saga implementation
// actions
export const ensureImage = (imageDescriptor, force) => {
  return (dispatch, getstate) => {
    const listKey = listKeyFromImageDescriptor(imageDescriptor);
    const byKeys = getstate().images.byKeys[listKey] || {};
    const key = makeImageKey(imageDescriptor);
    const image = byKeys[key];
    const notNeeded = image && (image.loading || (image.url && !force));
    if (notNeeded) return;

    const body = JSON.stringify(imageDescriptor);
    // const headers = {
    //   'Content-Type': 'application/json',
    //   Accept: 'application/json'
    // };

    // mark image request in progress
    dispatch(requestImageAction({ imageDescriptor }));

    const apiServer = process.env.REACT_APP_REST_SERVER || 'http://localhost:3001';

    // invoke api to check/generate the file
    return fetch(apiServer + '/api/images/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body
    })
    .then((response) => {
      if (response.status >= 400) {
        throw new Error('ensureImage: Bad response from server');
      }
      return response.json();
    })
    .then(({ url, jobId, error }) => {
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


// reducers

