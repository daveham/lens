import { combineReducers } from 'redux';
import { InsertableReducer } from 'modules/types';
import { ACTIONS } from './actions';

const loading = (state = false, action) => {
  switch (action.type) {
    case ACTIONS.REQUEST_HELLO:
      return true;
    case ACTIONS.RECEIVE_HELLO:
    case ACTIONS.REQUEST_HELLO_FAILED:
      return false;
    default:
      return state;
  }
};

const greeting = (state = '', action) => {
  switch (action.type) {
    case ACTIONS.RECEIVE_HELLO:
      return action.payload.greeting + ', ' + action.payload.name;
    default:
      return state;
  }
};

const featureAReducer: InsertableReducer = combineReducers({
  greeting,
  loading
});

featureAReducer.reducer = 'featureA';

export default featureAReducer;
