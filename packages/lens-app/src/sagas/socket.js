import { channel } from 'redux-saga';
import { call, takeEvery, all, put, take, select } from 'redux-saga/effects';
import {
  ACTIONS,
  receiveSocket,
  requestSocketFailed,
  receiveServiceCommand
} from '../modules/common';

import io from 'socket.io-client';

import _debug from 'debug';
const debug = _debug('lens:socket');

const socketHost = process.env.REACT_APP_SERVICE_SERVER;

const socketChannel = channel();

export function* watchSocketChannel() {
// eslint-disable-next-line no-constant-condition
  while(true) {
    const action = yield take(socketChannel);
    debug('watchSocketChannel', { action });
    yield put(action);
  }
}

export function* connectSocket() {
  debug('connectSocket saga called');

  debug(`connecting to '${socketHost}'`);
  const socket = io(socketHost);

  socket.on('connect', () => {
    debug('connected');
    socketChannel.put(receiveSocket(socket));
  });

  socket.on('disconnect', () => {
    debug('disconnected');
  });

  socket.on('reconnect', () => {
    debug('reconnected');
  });

  socket.on('error', err => {
    debug('error', err);
    socketChannel.put(requestSocketFailed(err)); // TODO: is this the right action to take here?
  });

  yield socket;

  socket.on('flash', payload => {
    debug('socket received flash message', payload);
    socketChannel.put(receiveServiceCommand(payload));
  });

 socket.on('job', payload => {
   debug('socket received job message', { payload });
   socketChannel.put(receiveServiceCommand(payload));
 });

}

export const socketSelector = (state) => state.common.socket;
export const clientIdSelector = (state) => state.common.clientId;

let flashCounter = 0;

export function* socketSend({ payload }) {
  debug('socketSend', payload);
  const socket = yield select(socketSelector);
  if (socket) {
    const data = {
      flashId: flashCounter++,
      created: Date.now(),
      ...payload
    };
    debug('sending flash message on socket', data);
    socket.emit('flash', data);
  } else {
    debug('no socket to send on');
  }
}

export default function* socketSaga() {
  yield all([
    takeEvery(ACTIONS.REQUEST_SOCKET, connectSocket),
    takeEvery(ACTIONS.SEND_SOCKET_COMMAND, socketSend),
    call(watchSocketChannel)
  ]);
}
