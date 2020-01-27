import { combineReducers } from 'redux';
import { createActions, combineActions, handleActions } from 'redux-actions';

export const {
  testActionOne,
  testActionTwo,
  requestSocketId,
  receiveSocketId,
  requestSocketIdFailed,
  sendPing,
  pingSent,
  pingSendFailed,
  sendSocketCommand,
  // sendSocketCommandFailed,
  receiveServiceCommand,
} = createActions(
  'TEST_ACTION_ONE',
  'TEST_ACTION_TWO',
  'REQUEST_SOCKET_ID',
  'RECEIVE_SOCKET_ID',
  'REQUEST_SOCKET_ID_FAILED',
  'SEND_PING',
  'PING_SENT',
  'PING_SEND_FAILED',
  'SEND_SOCKET_COMMAND',
  'SEND_SOCKET_COMMAND_FAILED',
  'RECEIVE_SERVICE_COMMAND',
  {
    prefix: 'COMMON',
  },
);

// reducers
const testOne = handleActions(
  {
    [testActionOne]: () => 'test-one',
  },
  '',
);

const testTwo = handleActions(
  {
    [testActionTwo]: () => 'test-two',
  },
  '',
);

const connecting = handleActions(
  {
    [requestSocketId]: () => true,
    [combineActions(receiveSocketId, requestSocketIdFailed)]: () => false,
  },
  false,
);

const emptySocketId = '';
const socketId = handleActions(
  {
    [receiveSocketId]: (state, { payload }) => payload,
  },
  emptySocketId,
);

const clientId = handleActions(
  {
    [receiveServiceCommand]: (state, { payload }) =>
      payload.command === 'registered' ? payload.clientId : state,
  },
  -1,
);

const command = handleActions(
  {
    [receiveServiceCommand]: (state, { payload }) => payload,
  },
  null,
);

export default combineReducers({
  connecting,
  socketId,
  clientId,
  command,
  testOne,
  testTwo,
});
