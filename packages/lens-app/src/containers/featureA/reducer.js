import { combineReducers } from 'redux';
import { ACTIONS } from './actions';

// reducers
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

const featureAReducer = combineReducers({
  loading,
  greeting
});

featureAReducer.reducer = 'featureA';

export default featureAReducer;
