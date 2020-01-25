import { createActions } from 'redux-actions';

export const {
  requestCatalog,
  receiveCatalog,
  requestCatalogFailed,
  ensureCatalogTitle,
} = createActions(
  'REQUEST_CATALOG',
  'RECEIVE_CATALOG',
  'REQUEST_CATALOG_FAILED',
  'ENSURE_CATALOG_TITLE',
  {
    prefix: 'catalog',
  }
);
