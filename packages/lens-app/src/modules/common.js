import { combineReducers } from 'redux';
import { createActions, combineActions, handleActions } from 'redux-actions';

import _debug from 'debug';
const debug = _debug('lens:common');

export const {
  requestSocketStatus,
  receiveSocketStatus,
  requestSocketStatusFailed,
  sendPing,
  pingSent,
  pingSendFailed,
  sendSocketCommand,
  // sendSocketCommandFailed,
  receiveServiceCommand,
} = createActions(
  'REQUEST_SOCKET_STATUS',
  'RECEIVE_SOCKET_STATUS',
  'REQUEST_SOCKET_STATUS_FAILED',
  'SEND_PING',
  'PING_SENT',
  'PING_SEND_FAILED',
  'SEND_SOCKET_COMMAND',
  // 'SEND_SOCKET_COMMAND_FAILED',
  'RECEIVE_SERVICE_COMMAND',
  {
    prefix: 'COMMON',
  },
);

// reducers
const connecting = handleActions(
  {
    [requestSocketStatus]: () => true,
    [combineActions(receiveSocketStatus, requestSocketStatusFailed)]: () => false,
  },
  false,
);

const emptySocket = {
  status: '',
  id: '',
};
const socketStatus = handleActions(
  {
    [receiveSocketStatus]: (state, { payload }) => {
      const { id: currentId, status: currentStatus } = state;
      const { status, id } = payload || emptySocket;
      debug('receiveSocketStatus', {
        currentId,
        currentStatus,
        id,
        status,
      });

      switch(status) {
        case 'connect':
          return { status, id };

        case 'reconnect':
          return { status, id };

        case 'disconnect':
          return { status, id };

        default:
          debug('receiveSocketStatus - unexpected case', { status, id });
          return state;
      }
    },
  },
  emptySocket,
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
  socketStatus,
  clientId,
  command,
});
