import { takeEvery, select, all, put } from 'redux-saga/effects';
// import { apiSaga, invokeRestService } from 'sagas/utils';
import {
  ensureEditorTitle,
  requestSimulationsForSource,
  receiveSimulationsForSource,
  requestHikes,
  receiveHikes,
  // requestSimulationsForSourceFailed,
} from '../modules/actions';
import {
  catalogName as catalogNameSelector,
  catalogSources as catalogSourcesSelector,
} from 'containers/catalog/selectors';
import { setTitle } from 'modules/ui';
import { generateMockHikesData, generateMockSimulationsData } from './mockData';
import editSaga from './edit';

import _debug from 'debug';
const debug = _debug('lens:editor:sagas');

export function* ensureTitleSaga({ payload }) {
  const catalogName = yield select(catalogNameSelector);
  if (payload) {
    const catalogSources = yield select(catalogSourcesSelector);
    const sourceName = catalogSources.byIds[payload].name;
    yield put(setTitle({
      catalogName,
      sourceName,
    }));
  } else {
    yield put(setTitle({ catalogName }));
  }
}

export function* readSimulationsForSourceSaga({ payload }) {
  debug('readSimulationsForSourceSaga', { payload });

  const mockData = generateMockSimulationsData(payload);
  yield put(receiveSimulationsForSource(mockData));

  // yield* apiSaga(invokeRestService,
  //   [ `/simulations/${payload}` ],
  //   receiveSimulationsForSource,
  //   requestSimulationsForSourceFailed);
}

export function* readHikesSaga({ payload }) {
  debug('readHikesSaga', { payload });
  const mockData = generateMockHikesData(payload);
  yield put(receiveHikes(mockData));
}

export function* rootSaga() {
  yield all([
    takeEvery(ensureEditorTitle, ensureTitleSaga),
    takeEvery(requestSimulationsForSource, readSimulationsForSourceSaga),
    takeEvery(requestHikes, readHikesSaga),
    editSaga(),
  ]);
}

export default { key: 'editor', saga: rootSaga };
