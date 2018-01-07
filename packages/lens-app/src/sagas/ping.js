import { takeEvery, all, select } from 'redux-saga/effects';
import { invokeRestService, apiSaga } from './utils';
import { clientIdSelector } from './socket';
import { ACTIONS, pingSent, pingSendFailed } from '../modules/common';

export function* sendPingSaga() {
  const clientId = yield select(clientIdSelector);
  const body = { clientId, created: Date.now() };
  yield* apiSaga(invokeRestService, [ '/ping', { method: 'POST', body } ], pingSent, pingSendFailed);
}

export default function* pingSaga() {
  yield all([
    takeEvery(ACTIONS.SEND_PING, sendPingSaga)
  ]);
}
