import { call, takeEvery, all } from 'redux-saga/effects';
import { ACTIONS } from '../modules/common';
import { connectSocket, watchSocketChannel, socketSend } from './socket';

export function* rootSaga() {
  yield all([
    takeEvery(ACTIONS.REQUEST_SOCKET, connectSocket),
    takeEvery(ACTIONS.SEND_SOCKET_COMMAND, socketSend),
    call(watchSocketChannel)
  ]);
}

export default { key: 'base', saga: rootSaga };
