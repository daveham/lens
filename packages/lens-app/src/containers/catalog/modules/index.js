import { combineReducers } from 'redux';
import { ACTIONS } from './actions';

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
