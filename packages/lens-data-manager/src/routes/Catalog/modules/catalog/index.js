import { combineReducers } from 'redux';
import sources from './sources';
import sourcesMetadata from './sources-metadata';
import sourcesThumbs from './sources-thumbs';

import { ACTIONS } from './constants';

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

export default combineReducers({
  loading,
  name,
  sources,
  sourcesMetadata,
  sourcesThumbs
});
