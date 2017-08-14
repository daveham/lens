import { combineReducers } from 'redux';
import { createAction } from 'redux-actions';

export const ACTIONS = {
  TEST_ACTION_ONE: 'TEST_ACTION_ONE',
  TEST_ACTION_TWO: 'TEST_ACTION_TWO',

  REQUEST_SOCKET: 'REQUEST_SOCKET',
  RECEIVE_SOCKET: 'RECEIVE_SOCKET',
  REQUEST_SOCKET_FAILED: 'REQUEST_SOCKET_FAILED'
};

// actions (action creators)
export const testOneAction = createAction(ACTIONS.TEST_ACTION_ONE);
export const testTwoAction = createAction(ACTIONS.TEST_ACTION_TWO);

export const requestSocket = createAction(ACTIONS.REQUEST_SOCKET);
export const receiveSocket = createAction(ACTIONS.RECEIVE_SOCKET);
export const requestSocketFailed = createAction(ACTIONS.REQUEST_SOCKET_FAILED);

export const actions = {
  requestSocket,
  receiveSocket,
  requestSocketFailed
};

// reducers
const testOne = (state = '', { type }) => {
  if (type === ACTIONS.TEST_ACTION_ONE) {
    return 'test-one';
  }
  return state;
};

const testTwo = (state = '', { type }) => {
  if (type === ACTIONS.TEST_ACTION_TWO) {
    return 'test-two';
  }
  return state;
};

const connecting = (state = false, { type }) => {
  switch (type) {
    case ACTIONS.REQUEST_SOCKET:
      return true;
    case ACTIONS.RECEIVE_SOCKET:
    case ACTIONS.REQUEST_SOCKET_FAILED:
      return false;
    default:
      return state;
  }
};

const socket = (state = null, { type, payload }) => {
  if (type === ACTIONS.RECEIVE_SOCKET) {
    return payload;
  }
  return state;
};

export default combineReducers({
  connecting,
  socket,
  testOne,
  testTwo
});
