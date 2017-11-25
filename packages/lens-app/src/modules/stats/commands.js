import { put } from 'redux-saga/effects';
import { statsLoaded } from './actions';

import _debug from 'debug';
const debug = _debug('lens:stats:commands');

function* statsHandler(payload) {
  debug('stats command handler', payload);
  const { statsDescriptor, data } = payload;
  yield put(statsLoaded({ statsDescriptor, data} ));
}

export default {
  stats: statsHandler
};
