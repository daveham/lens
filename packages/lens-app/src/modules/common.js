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

const emptySocketStatus = { status: '', id: '' };
const errorSocketStatus = { status: 'error', id: '' };
const socketStatus = handleActions(
  {
    [requestSocketStatusFailed]: () => errorSocketStatus,
    [receiveSocketStatus]: (state, { payload }) => {
      const { status: currentStatus, id: currentId } = state;
      const { status, id } = payload || emptySocketStatus;
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
          return state;
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
