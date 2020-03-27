import { channel } from 'redux-saga';
import { call, takeEvery, takeLeading, all, put, select, take } from 'redux-saga/effects';
import {
  receiveSocketStatus,
  requestSocketStatus,
  requestSocketStatusFailed,
  receiveServiceCommand,
  sendSocketCommand,
} from '../modules/common';
import { socketId as socketIdSelector } from '../modules/selectors';

import io from 'socket.io-client';

import _debug from 'debug';
const debug = _debug('lens:socket');

const socketHost = process.env.REACT_APP_SERVICE_SERVER;

const socketChannel = channel();
let socket;

export function* watchSocketChannel() {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const action = yield take(socketChannel);
    debug('watchSocketChannel', { action });
    yield put(action);
  }
}

export function* connectSocket() {
  debug(`connectSocket saga, connecting to '${socketHost}'`);
  socket = io(socketHost);

  socket.on('connect', () => {
    socketChannel.put(receiveSocketStatus({ id: socket.id, status: 'connect' }));
  });

  socket.on('disconnect', () => {
    socketChannel.put(receiveSocketStatus({ id: socket.id, status: 'disconnect' }));
  });

  socket.on('reconnect', () => {
    socketChannel.put(receiveSocketStatus({ id: socket.id, status: 'reconnect' }));
  });

  socket.on('error', err => {
    debug('error', err);
    socketChannel.put(requestSocketStatusFailed(err));
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

let flashCounter = 0;

export function* socketSend({ payload }) {
  debug('socketSend', payload);
  const socketId = yield select(socketIdSelector);
  if (socketId) {
    const data = {
      flashId: flashCounter++,
      created: Date.now(),
      ...payload,
    };
    debug('sending flash message on socket', data);
    socket.emit('flash', data);
  } else {
    debug('no socket to send on');
  }
}

export default function* socketSaga() {
  yield all([
    takeLeading(requestSocketStatus, connectSocket),
    takeEvery(sendSocketCommand, socketSend),
    call(watchSocketChannel),
  ]);
}
