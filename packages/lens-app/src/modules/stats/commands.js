import { put } from 'redux-saga/effects';
import { statsLoaded } from './actions';

import getDebugLog from './debugLog';
const debug = getDebugLog('commands');

function* statsHandler(payload) {
  debug('stats command handler', payload);
  const { statsDescriptor, result: { data } } = payload;
  yield put(statsLoaded({ statsDescriptor, data }));
}

export default {
  stats: statsHandler
};
