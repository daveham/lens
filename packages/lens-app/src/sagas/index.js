import { call, takeEvery, all, select } from 'redux-saga/effects';
import { ACTIONS, pingSent, pingSendFailed } from '../modules/common';
import { invokeRestService, apiSaga } from './utils';
import { connectSocket, watchSocketChannel, socketSend, clientIdSelector } from './socket';

export function* sendPingSaga() {
  const clientId = yield select(clientIdSelector);
  yield* apiSaga(invokeRestService, [ '/ping', { method: 'POST', body: { clientId }} ], pingSent, pingSendFailed);
}

export function* rootSaga() {
  yield all([
    takeEvery(ACTIONS.REQUEST_SOCKET, connectSocket),
    takeEvery(ACTIONS.SEND_SOCKET_COMMAND, socketSend),
    takeEvery(ACTIONS.SEND_PING, sendPingSaga),
    call(watchSocketChannel)
  ]);
}

export default { key: 'base', saga: rootSaga };
