import { createAction } from 'redux-actions';
import fetch from 'isomorphic-fetch';

import { ACTIONS } from './constants';

import debugLib from 'debug';
const debug = debugLib('app:module:catalog-actions');

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

