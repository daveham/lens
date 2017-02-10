import { createAction } from 'redux-actions';
import fetch from 'isomorphic-fetch';

import debugLib from 'debug';
const debug = debugLib('app:module:sources-thumbs-actions');

import { ACTIONS } from './constants';

const requestSourceThumbs = createAction(ACTIONS.REQUEST_SOURCE_THUMBS);
const receiveSourceThumbs = createAction(ACTIONS.RECEIVE_SOURCE_THUMBS);
const requestSourceThumbsFailed = createAction(ACTIONS.REQUEST_SOURCE_THUMBS_FAILED);
export const fetchSourceThumbs = () => {
  return (dispatch /*, getState */) => {
    dispatch(requestSourceThumbs());

    return fetch('/api/sourcethumbs')
      .then(response => response.json())
      .then(json => {
        debug('get sourcethumbs response', json);
        dispatch(receiveSourceThumbs(json));
      })
      .catch(reason => {
        debug('get sourcethumbs error', reason);
        dispatch(requestSourceThumbsFailed({ reason }));
      });
  };
};

const generateSourceThumbStart = createAction(ACTIONS.GENERATE_SOURCE_THUMB);
const sourceThumbGenerated = createAction(ACTIONS.SOURCE_THUMB_GENERATED);
const generateSourceThumbFailed = createAction(ACTIONS.GENERATE_SOURCE_THUMB_FAILED);
export const generateSourceThumb = (id, sourceName) => {
  return (dispatch /*, getState */) => {
    dispatch(generateSourceThumbStart({ id }));

    const body = JSON.stringify({ id, sourceName });
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    };
    return fetch('/api/sourcethumbs/', { method: 'POST', body, headers })
      .then(() => {
        dispatch(sourceThumbGenerated({ id }));
      })
      .catch(reason => {
        debug('generate source thumb error', reason);
        dispatch(generateSourceThumbFailed({ id, reason }));
      });
  };
};

export const actions = {
  fetchSourceThumbs,
  generateSourceThumb
};
