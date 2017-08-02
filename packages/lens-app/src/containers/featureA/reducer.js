import { combineReducers } from 'redux';
import { createAction } from 'redux-actions';

import _debug from 'debug';
const debug = _debug('app:hello');

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

export const fetchHello = () => {
  return (dispatch /*, getState */) => {
    dispatch(requestHello());

    const apiServer = process.env.REACT_APP_REST_SERVER || 'http://localhost:3001';
    
    return fetch(apiServer +  '/hello/dave', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(json => {
      debug('fetch response', json);
      dispatch(receiveHello(json));
    })
    .catch(reason => {
      debug('fetch error', reason);
      dispatch(requestHelloFailed(reason));
    });
  };
};

export const actions = {
  requestHello,
  receiveHello,
  requestHelloFailed,
  fetchHello
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
