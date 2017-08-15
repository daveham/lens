
import { channel } from 'redux-saga';
import { put, take, select } from 'redux-saga/effects';
import { receiveSocket, requestSocketFailed } from '../modules/common';

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
//    dispatch(receiveServiceCommand(payload));
  });

//  socket.on('job', payload => {
//    debug('socket job message', { payload });
//    dispatch(receiveServiceCommand(payload));
//  });

}

const socketSelector = (state) => state.common.socket;

export function* socketSend({ payload }) {
  const socket = yield select(socketSelector);
  if (socket) {
    debug('sending flash message on socket', payload);
    socket.emit('flash', payload);
  } else {
    debug('no socket to send on');
  }
}

