import { combineReducers } from 'redux';
import { createAction } from 'redux-actions';

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

export const actions = {
  requestCatalog,
  receiveCatalog,
  requestCatalogFailed
};

// reducers
const loading = (state = false, { type }) => {
  switch (type) {
    case ACTIONS.REQUEST_CATALOG:
      return true;
    case ACTIONS.RECEIVE_CATALOG:
    case ACTIONS.REQUEST_CATALOG_FAILED:
      return false;
    default:
      return state;
  }
};

const name = (state = '', { type, payload }) => {
  switch (type) {
    case ACTIONS.RECEIVE_CATALOG:
      return payload.name;
    default:
      return state;
  }
};

const sources = (state = {  ids: [], byIds: {} }, { type, payload}) => {
  switch (type) {
    case ACTIONS.RECEIVE_CATALOG: {
      const { sources } = payload;
      const ids = sources.map(source => source.id);
      const byIds = {};
      sources.forEach(source => byIds[source.id] = source);
      return { ids, byIds };
    }
    default:
      return state;
  }
};

const catalogReducer = combineReducers({
  loading,
  name,
  sources
});

catalogReducer.reducer = 'catalog';

export default catalogReducer;
