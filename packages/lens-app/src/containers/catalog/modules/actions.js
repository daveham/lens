import { createAction } from 'redux-actions';

// constants
export const ACTIONS = {
  REQUEST_CATALOG: 'REQUEST_CATALOG',
  RECEIVE_CATALOG: 'RECEIVE_CATALOG',
  REQUEST_CATALOG_FAILED: 'REQUEST_CATALOG_FAILED',

  ENSURE_CATALOG_TITLE: 'ENSURE_CATALOG_TITLE',
};

// actions
export const requestCatalog = createAction(ACTIONS.REQUEST_CATALOG);
export const receiveCatalog = createAction(ACTIONS.RECEIVE_CATALOG);
export const requestCatalogFailed = createAction(ACTIONS.REQUEST_CATALOG_FAILED);

export const ensureCatalogTitle = createAction(ACTIONS.ENSURE_CATALOG_TITLE);

export const actions = {
  requestCatalog,
  receiveCatalog,
  requestCatalogFailed,
  ensureCatalogTitle,
};
