import { combineReducers } from 'redux';
import { createAction } from 'redux-actions';

// constants
export const ACTIONS = {
  REQUEST_HELLO: 'REQUEST_HELLO',
  RECEIVE_HELLO: 'RECEIVE_HELLO',
  REQUEST_HELLO_FAILED: 'REQUEST_HELLO_FAILED'
};

// actions
export const requestHello = createAction(ACTIONS.REQUEST_HELLO);
export const receiveHello = createAction(ACTIONS.RECEIVE_HELLO);
export const requestHelloFailed = createAction(ACTIONS.REQUEST_HELLO_FAILED);

export const actions = {
  requestHello,
  receiveHello,
  requestHelloFailed
};

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
