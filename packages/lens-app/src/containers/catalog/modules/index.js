import { combineReducers } from 'redux';
import { createAction } from 'redux-actions';
import fetch from 'isomorphic-fetch';

import _debug from 'debug';
const debug = _debug('app:catalog');

// constants
export const ACTIONS = {
  REQUEST_CATALOG: 'REQUEST_CATALOG',
  RECEIVE_CATALOG: 'RECEIVE_CATALOG',
  REQUEST_CATALOG_FAILED: 'REQUEST_CATALOG_FAILED'
};

// actions
export const requestCatalog = createAction(ACTIONS.REQUEST_CATALOG);
export const receiveCatalog = createAction(ACTIONS.RECEIVE_CATALOG);
export const requestCatalogFailed = createAction(ACTIONS.REQUEST_CATALOG_FAILED);
export const fetchCatalog = () => {
  return (dispatch /*, getState */) => {
    dispatch(requestCatalog());

    return fetch('/api/catalog')
    .then(response => response.json())
    .then(json => {
      debug('fetch response', json);
      dispatch(receiveCatalog(json));
    })
    .catch(reason => {
      debug('fetch error', reason);
      dispatch(requestCatalogFailed(reason));
    });
  };
};

export const actions = {
  requestCatalog,
  receiveCatalog,
  requestCatalogFailed,
  fetchCatalog
};

// reducers
const loading = (state = false, action) => {
  switch (action.type) {
    case ACTIONS.REQUEST_CATALOG:
      return true;
    case ACTIONS.RECEIVE_CATALOG:
    case ACTIONS.REQUEST_CATALOG_FAILED:
      return false;
    default:
      return state;
  }
};

const name = (state = '', action) => {
  switch (action.type) {
    case ACTIONS.RECEIVE_CATALOG:
      return action.payload.name;
    default:
      return state;
  }
};

const catalogReducer = combineReducers({
  loading,
  name
});

catalogReducer.reducer = 'catalog';

export default catalogReducer;
