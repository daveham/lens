import { all } from 'redux-saga/effects';
import socketSaga from './socket';
import commandSaga from './command';
import pingSaga from './ping';
import imagesSaga from './images';
import statsSaga from './stats';

export function* rootSaga() {
  yield all([
    socketSaga(),
    commandSaga(),
    imagesSaga(),
    statsSaga(),
    pingSaga()
  ]);
}

export default { key: 'base', saga: rootSaga };
