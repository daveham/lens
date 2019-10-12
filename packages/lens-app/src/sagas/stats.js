import { takeEvery, select, all, call, put } from 'redux-saga/effects';
import { apiSaga, invokeRestService } from './utils';
import { clientIdSelector } from './socket';
import {
  ensureStats,
  statsLoading,
  statsLoaded,
  statsNotLoading,
  deleteStats,
  statsDeleted,
  statsDeleteFailed
} from '../modules/stats/actions';
import { statsSelector } from '../modules/stats/selectors';

import _debug from 'debug';
const debug = _debug('lens:saga:stats');

export function* ensureStatsSaga({ payload }) {
  const { statsDescriptor, force } = payload;
  const stats = yield select(statsSelector, statsDescriptor);
  const notNeeded = stats && (stats.data && !force);
  if (notNeeded) {
    return undefined;
  }

  yield put(statsLoading({ statsDescriptor }));
  const clientId = yield select(clientIdSelector);
  try {
    const body = { clientId, statsDescriptor };
    const payload = yield call(invokeRestService, '/stats', { method: 'POST', body });

    const { status } = payload;
    if (status === 'ok') {
      yield put(statsLoaded({ statsDescriptor, data: payload.data }));
    } else if (status === 'bad') {
      debug('stats api returned error', { error: payload.error });
      yield put(statsNotLoading({ statsDescriptor, error: payload.error }));
    }
  } catch (error) {
    debug('stats api exception', error);
    yield put(statsNotLoading({ statsDescriptor, error }));
  }
}

export function* deleteStatsSaga({ payload }) {
  const { sourceId, group } = payload;
  const clientId = yield select(clientIdSelector);
  const body = { clientId, sourceId, group };
  yield* apiSaga(invokeRestService, [ '/deleteStats', { method: 'POST', body } ], statsDeleted, statsDeleteFailed);
}

export default function* statsSaga() {
  yield all([
    takeEvery(ensureStats, ensureStatsSaga),
    takeEvery(deleteStats, deleteStatsSaga)
  ]);
}
