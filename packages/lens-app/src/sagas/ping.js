import { takeEvery, all, select } from 'redux-saga/effects';
import { restApiSaga } from './utils';
import { clientId as clientIdSelector } from '../modules/selectors';
import { sendPing, pingSent, pingSendFailed } from '../modules/common';

export function* sendPingSaga() {
  const clientId = yield select(clientIdSelector);
  const body = { clientId, created: Date.now() };
  yield* restApiSaga(['/ping', { method: 'POST', body }], pingSent, pingSendFailed);
}

export default function* pingSaga() {
  yield all([takeEvery(sendPing, sendPingSaga)]);
}
