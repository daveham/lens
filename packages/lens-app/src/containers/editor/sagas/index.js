import { takeEvery, select, all, put } from 'redux-saga/effects';
import { apiSaga, invokeRestService } from 'sagas/utils';
import { ACTIONS } from '../modules/constants';
import {
  receiveSimulationsForSource,
  requestSimulationsForSourceFailed,
} from '../modules/actions';
import {
  catalogName as catalogNameSelector,
  catalogSources as catalogSourcesSelector,
} from 'containers/catalog/selectors';
import { setTitle } from 'modules/ui';

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
  yield* apiSaga(invokeRestService,
    [ `/simulations/${payload}` ],
    receiveSimulationsForSource,
    requestSimulationsForSourceFailed);
}

export function* rootSaga() {
  yield all([
    takeEvery(ACTIONS.ENSURE_EDITOR_TITLE, ensureTitleSaga),
    takeEvery(ACTIONS.REQUEST_SIMULATIONS_FOR_SOURCE, readSimulationsForSourceSaga),
  ]);
}

export default { key: 'editor', saga: rootSaga };
