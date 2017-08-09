import { takeEvery, all } from 'redux-saga/effects';
import { invokeRestService, apiSaga } from '../../sagas';
import { ACTIONS, receiveHello, requestHelloFailed } from './reducer';

export function* loadHello() {
  yield* apiSaga(invokeRestService, [ '/hello/dave' ], receiveHello, requestHelloFailed);
}

export function* rootSaga() {
  yield all([
    takeEvery(ACTIONS.REQUEST_HELLO, loadHello)
  ]);
}

export default { key: 'featureA', saga: rootSaga };
