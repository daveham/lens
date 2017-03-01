import { combineReducers } from 'redux';
import sources from './sources';
import images from './images';

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

export default {
  catalog: combineReducers({
    loading,
    name
  }),
  sources,
  images
};
