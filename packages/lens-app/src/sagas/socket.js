import { channel } from 'redux-saga';
import { call, takeEvery, all, put, select, take } from 'redux-saga/effects';
import {
  receiveSocketId,
  requestSocketId,
  requestSocketIdFailed,
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
  debug('connectSocket saga called');

  debug(`connecting to '${socketHost}'`);
  socket = io(socketHost);

  socket.on('connect', () => {
    debug('connected');
    socketChannel.put(receiveSocketId(socket.id));
  });

  socket.on('disconnect', () => {
    socketChannel.put(receiveSocketId(''));
    debug('disconnected');
  });

  socket.on('reconnect', () => {
    socketChannel.put(receiveSocketId(socket.id));
    debug('reconnected');
  });

  socket.on('error', err => {
    debug('error', err);
    socketChannel.put(requestSocketIdFailed(err)); // TODO: is this the right action to take here?
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
    takeEvery(requestSocketId, connectSocket),
    takeEvery(sendSocketCommand, socketSend),
    call(watchSocketChannel),
  ]);
}
