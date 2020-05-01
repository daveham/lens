import { all, take } from 'redux-saga/effects';
import socketSaga from './socket';
import commandSaga from './command';
import pingSaga from './ping';
import imagesSaga from './images';
import statsSaga from './stats';

import getDebugLog from './debugLog';
const debug = getDebugLog();

function* observeActions() {
  while (true) {
    debug((yield take('*')).type);
  }
}

export function* rootSaga() {
  yield all([observeActions(), socketSaga(), commandSaga(), imagesSaga(), statsSaga(), pingSaga()]);
}

export default { key: 'base', saga: rootSaga };
