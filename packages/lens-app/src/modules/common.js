import { combineReducers } from 'redux';
import { createActions, combineActions, handleActions } from 'redux-actions';

import getDebugLog from './debugLog';
const debug = getDebugLog('common');

export const {
  closeSocket,
  socketClosed,
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
  'CLOSE_SOCKET',
  'SOCKET_CLOSED',
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
    [combineActions(receiveSocketStatus, requestSocketStatusFailed, socketClosed)]: () => false,
  },
  false,
);

const emptyValue = '';
const emptySocketStatus = { status: emptyValue, id: emptyValue };
const errorSocketStatus = { status: 'error', id: emptyValue };
const socketStatus = handleActions(
  {
    [socketClosed]: () => emptySocketStatus,
    [requestSocketStatusFailed]: () => errorSocketStatus,
    [receiveSocketStatus]: (state, { payload }) => {
      const { status: currentStatus, id: currentId } = state;
      const { status, id = emptyValue } = payload;
      debug('receiveSocketStatus', {
        currentStatus,
        currentId,
        status,
        id,
      });

      if (
        currentStatus === 'error' ||
        status === 'error' ||
        ((status === 'connect' || status === 'reconnect') && !id)
      ) {
        debug('returning error socket status');
        return errorSocketStatus;
      }

      switch (status) {
        case 'connect':
          return { status, id };

        case 'reconnect':
          return { status, id };

        case 'disconnect':
          return { status, id };

        default:
          debug('receiveSocketStatus - unexpected case', { status, id });
          return errorSocketStatus;
      }
    },
  },
  emptySocketStatus,
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
