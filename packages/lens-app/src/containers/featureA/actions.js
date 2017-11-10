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

