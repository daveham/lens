import { createAction } from 'redux-actions';
import fetch from 'isomorphic-fetch';

import { ACTIONS } from './constants';

import debugLib from 'debug';
const debug = debugLib('app:module:sources-metadata-actions');

const requestSourceMetadata = createAction(ACTIONS.REQUEST_SOURCE_METADATA);
const receiveSourceMetadata = createAction(ACTIONS.RECEIVE_SOURCE_METADATA);
const requestSourceMetadataFailed = createAction(ACTIONS.REQUEST_SOURCE_METADATA_FAILED);
export const fetchSourceMetadata = (id) => {
  return (dispatch /*, getState */) => {
    dispatch(requestSourceMetadata({ id }));

    return fetch(`/api/sourcemetadata/${id}`)
      .then(response => response.json())
      .then(json => {
        debug('fetch response', json);
        dispatch(receiveSourceMetadata(json));
      })
      .catch(reason => {
        debug('fetch error', reason);
        dispatch(requestSourceMetadataFailed({ id, reason }));
      });
  };
};

const sourceMetadataDelete = createAction(ACTIONS.REQUEST_SOURCE_METADATA_DELETE);
const sourceMetadataDeleted = createAction(ACTIONS.REQUEST_SOURCE_METADATA_DELETED);
const sourceMetadataDeleteFailed = createAction(ACTIONS.REQUEST_SOURCE_METADATA_DELETE_FAILED);
export const deleteSourceMetadata = (id) => {
  return (dispatch /*, getState */) => {
    dispatch(sourceMetadataDelete({ id }));

    return fetch(`/api/sourcemetadata/${id}`, { method: 'delete' })
      .then(() => {
        dispatch(sourceMetadataDeleted({ id }));
      })
      .catch(reason => {
        debug('fetch.delete', reason);
        dispatch(sourceMetadataDeleteFailed({ id, reason }));
      });
  };
};

export const actions = {
  fetchSourceMetadata,
  deleteSourceMetadata
};
