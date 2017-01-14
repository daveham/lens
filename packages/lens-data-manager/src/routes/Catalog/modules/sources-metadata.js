import { createAction } from 'redux-actions';
import fetch from 'isomorphic-fetch';
import debugLib from 'debug';
const debug = debugLib('app:module:sources-metadata');

const REQUEST_SOURCE_METADATA = 'REQUEST_SOURCE_METADATA';
const RECEIVE_SOURCE_METADATA = 'RECEIVE_SOURCE_METADATA';
const REQUEST_SOURCE_METADATA_FAILED = 'REQUEST_SOURCE_METADATA_FAILED';

const REQUEST_SOURCE_METADATA_DELETE = 'REQUEST_SOURCE_METADATA_DELETE';
const REQUEST_SOURCE_METADATA_DELETE_FAILED = 'REQUEST_SOURCE_METADATA_DELETE_FAILED';
const REQUEST_SOURCE_METADATA_DELETED = 'REQUEST_SOURCE_METADATA_DELETED';

// actions
const requestSourceMetadata = createAction(REQUEST_SOURCE_METADATA);
const receiveSourceMetadata = createAction(RECEIVE_SOURCE_METADATA);
const requestSourceMetadataFailed = createAction(REQUEST_SOURCE_METADATA_FAILED);
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

const sourceMetadataDelete = createAction(REQUEST_SOURCE_METADATA_DELETE);
const sourceMetadataDeleted = createAction(REQUEST_SOURCE_METADATA_DELETED);
const sourceMetadataDeleteFailed = createAction(REQUEST_SOURCE_METADATA_DELETE_FAILED);
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

const objectReducer = (state = {}, { payload }) => {
  return {
    ...state,
    ...payload,
    loading: false
  };
};
const objectLoadingReducer = (state = {}, loading) => {
  return {
    ...state,
    loading
  };
};

// reducer
export default (state = {}, action) => {
  switch (action.type) {
    case REQUEST_SOURCE_METADATA: {
      const { id } = action.payload;
      return {
        ...state,
        [id]: objectLoadingReducer(state[id], true)
      };
    }

    case REQUEST_SOURCE_METADATA_FAILED: {
      const { id } = action.payload;
      return {
        ...state,
        [id]: objectLoadingReducer(state[id], false)
      };
    }

    case RECEIVE_SOURCE_METADATA: {
      const { id } = action.payload;
      return {
        ...state,
        [id]: objectReducer(state[id], action)
      };
    }

    case REQUEST_SOURCE_METADATA_DELETED: {
      const { id } = action.payload;
      const newState = { ...state };
      delete newState[id];
      return newState;
    }

    default:
      return state;
  }
};
