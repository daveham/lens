
import { channel } from 'redux-saga';
import { put, take } from 'redux-saga/effects';
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

  // if (typeof io === 'undefined') {
  //   debug('io not defined, service probably not running');
  //   yield put(requestSocketFailed('io not defined'));
  //   //dispatch(serviceFailed());
  //   return;
  // }

  // connect to lens-data-service, primarily for socket notifications
  debug(`connecting to '${socketHost}'`);
  const socket = io(socketHost);
  socket.on('connect', () => {
    debug('connected');
    socketChannel.put(receiveSocket(socket));
    //dispatch(receiveServiceConnected({ socket }));
  });
  socket.on('disconnect', () => {
    debug('disconnected');
  });
  socket.on('reconnect', () => {
    debug('reconnected');
  });
  socket.on('error', err => {
    debug('error', err);
    socketChannel.put(requestSocketFailed(err));
  });

  yield socket;

//  socket.on('flash', payload => {
//    debug('socket flash message', { payload });
//    dispatch(receiveServiceCommand(payload));
//  });

//  socket.on('job', payload => {
//    debug('socket job message', { payload });
//    dispatch(receiveServiceCommand(payload));
//  });

}

