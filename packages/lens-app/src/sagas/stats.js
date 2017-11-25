import { takeEvery, select, all, call, put } from 'redux-saga/effects';
import { invokeRestService } from './utils';
import { clientIdSelector } from './socket';
import {
  ACTIONS,
  statsLoading,
  statsLoaded,
  statsNotLoading
} from '../modules/stats/actions';
import { statsSelector } from '../modules/stats/selectors';

import _debug from 'debug';
const debug = _debug('lens:saga:stats');

export function* ensureStatsSaga({ payload }) {
  const { statsDescriptor, force } = payload;
  const stats = yield select(statsSelector, statsDescriptor);
  const notNeeded = stats && (stats.data && !force);
  if (notNeeded) {
    return;
  }

  yield put(statsLoading({ statsDescriptor }));
  const clientId = yield select(clientIdSelector);
  try {
    const body = { clientId, statsDescriptor };
    const payload = yield call(invokeRestService, '/stats', { method: 'POST', body });
    // TODO
    const { data } = payload;
    if (data) {
      debug('stats api returned data', data);
      yield put(statsLoaded({ statsDescriptor, data } ));
    // } else {
    //   debug('stats api did not return url');
    //   // TODO: replace this with no-op since job should be enqueued
    //   yield put(statsNotLoading({ statsDescriptor }));
    }
  } catch (error) {
    debug('stats api exception', error);
    yield put(statsNotLoading({ statsDescriptor }));
  }
}

export default function* statsSaga() {
  yield all([
    takeEvery(ACTIONS.STATS_ENSURE, ensureStatsSaga)
  ]);
}
