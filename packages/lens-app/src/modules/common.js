import { combineReducers } from 'redux';
import { createAction } from 'redux-actions';
import _debug from 'debug';
const debug = _debug('lens:sagas:common');

export const ACTIONS = {
  TEST_ACTION_ONE: 'TEST_ACTION_ONE',
  TEST_ACTION_TWO: 'TEST_ACTION_TWO',

  REQUEST_SOCKET: 'REQUEST_SOCKET',
  RECEIVE_SOCKET: 'RECEIVE_SOCKET',
  REQUEST_SOCKET_FAILED: 'REQUEST_SOCKET_FAILED',

  REGISTERED: 'REGISTERED',

  SEND_SOCKET_COMMAND: 'SEND_SOCKET_COMMAND',
  RECEIVE_SOCKET_COMMAND: 'RECEIVE_SOCKET_COMMAND',
  SEND_SOCKET_COMMAND_FAILED: 'SEND_SOCKET_COMMAND_FAILED',

  SEND_PING: 'SEND_PING',
  PING_SENT: 'PING_SENT',
  PING_SEND_FAILED: 'PING_SEND_FAILED',

  RECEIVE_SERVICE_COMMAND: 'RECEIVE_SERVICE_COMMAND'
};

// actions (action creators)
export const testOneAction = createAction(ACTIONS.TEST_ACTION_ONE);
export const testTwoAction = createAction(ACTIONS.TEST_ACTION_TWO);

export const requestSocket = createAction(ACTIONS.REQUEST_SOCKET);
export const receiveSocket = createAction(ACTIONS.RECEIVE_SOCKET);
export const requestSocketFailed = createAction(ACTIONS.REQUEST_SOCKET_FAILED);

export const registered = createAction(ACTIONS.REGISTERED);

export const sendPing = createAction(ACTIONS.SEND_PING);
export const pingSent = createAction(ACTIONS.PING_SENT);
export const pingSendFailed = createAction(ACTIONS.PING_SEND_FAILED);

export const sendSocketCommand = createAction(ACTIONS.SEND_SOCKET_COMMAND);
export const receiveSocketCommand = createAction(ACTIONS.RECEIVE_SOCKET_COMMAND);
export const sendSocketCommandFailed = createAction(ACTIONS.SEND_SOCKET_COMMAND_FAILED);

export const receiveServiceCommand = createAction(ACTIONS.RECEIVE_SERVICE_COMMAND);

export const actions = {
  requestSocket,
  receiveSocket,
  requestSocketFailed,
  sendSocketCommand,
  receiveSocketCommand,
  sendSocketCommandFailed,
  receiveServiceCommand
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
    debug('receive socket', payload.id);
    return payload;
  }
  return state;
};

const clientId = (state = -1, { type, payload }) => {
  if (type === ACTIONS.RECEIVE_SERVICE_COMMAND) {
    if (payload.command === 'registered') {
      debug('registered', payload);
      return payload.clientId;
    }
  }
  return state;
};

const command = (state = null, { type, payload }) => {
  if (type === ACTIONS.RECEIVE_SERVICE_COMMAND) {
    return payload;
  }
  return state;
};

export default combineReducers({
  connecting,
  socket,
  clientId,
  command,
  testOne,
  testTwo
});
