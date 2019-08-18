import { combineReducers } from 'redux';
import { ACTIONS } from './actions';
import { InsertableReducerType } from 'modules/types';

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
  if (type === ACTIONS.RECEIVE_CATALOG) {
    return payload.name;
  }
  return state;
};

const sources = (state = { ids: [], byIds: {} }, { type, payload}) => {
  if (type === ACTIONS.RECEIVE_CATALOG) {
    const { sources } = payload;
    const ids = sources.map((source) => source.id);
    const byIds = {};
    sources.forEach((source) => byIds[source.id] = source);
    return { ids, byIds };
  }
  return state;
};

const catalogModuleReducer = combineReducers({
  loading,
  name,
  sources,
});

export type CatalogModuleState = ReturnType<typeof catalogModuleReducer>;
export type InsertableCatalogModuleReducer = typeof catalogModuleReducer
  & InsertableReducerType;

const insertableCatalogModuleReducer: InsertableCatalogModuleReducer = catalogModuleReducer;

insertableCatalogModuleReducer.reducer = 'catalog';

export default insertableCatalogModuleReducer;
