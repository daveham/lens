import { combineReducers } from 'redux';
import { combineActions, handleActions } from 'redux-actions';
import { requestCatalog, receiveCatalog, requestCatalogFailed } from './actions';
import { InsertableReducerType } from 'modules/types';

// reducers
const loading = handleActions(
  {
    [requestCatalog]: () => true,
    [combineActions(receiveCatalog, requestCatalogFailed)]: () => false,
  },
  false,
);

const defaultEmptyName = '';
const name = handleActions(
  {
    [receiveCatalog]: (state, { payload }) => payload.name,
  },
  defaultEmptyName,
);

const defaultSources = { ids: [], byIds: [] };
const sources = handleActions(
  {
    [receiveCatalog]: (state, { payload }) => {
      const { sources } = payload;
      const ids = sources.map(source => source.id);
      const byIds = {};
      sources.forEach(source => (byIds[source.id] = source));
      return { ids, byIds };
    },
  },
  defaultSources,
);

const catalogModuleReducer = combineReducers({
  loading,
  name,
  sources,
});

export type CatalogModuleState = ReturnType<typeof catalogModuleReducer>;
export type InsertableCatalogModuleReducer = typeof catalogModuleReducer & InsertableReducerType;

const insertableCatalogModuleReducer: InsertableCatalogModuleReducer = catalogModuleReducer;

insertableCatalogModuleReducer.reducer = 'catalog';

export default insertableCatalogModuleReducer;
