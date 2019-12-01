import { takeEvery, select, all, put } from 'redux-saga/effects';
import { ensureEditorTitle } from '../modules/actions/ui';
import {
  catalogName as catalogNameSelector,
  catalogSources as catalogSourcesSelector,
} from 'containers/catalog/selectors';
import { setTitle } from 'modules/ui';
import dataSaga from './data';
import editSaga from './edit';
import operationsSaga from './operations';

// import _debug from 'debug';
// const debug = _debug('lens:editor:sagas');

export function* ensureTitleSaga({ payload }) {
  const catalogName = yield select(catalogNameSelector);
  if (payload) {
    const catalogSources = yield select(catalogSourcesSelector);
    const sourceName = catalogSources.byIds[payload].name;
    yield put(
      setTitle({
        catalogName,
        sourceName,
      }),
    );
  } else {
    yield put(setTitle({ catalogName }));
  }
}

export function* rootSaga() {
  yield all([
    takeEvery(ensureEditorTitle, ensureTitleSaga),
    dataSaga(),
    editSaga(),
    operationsSaga(),
  ]);
}

export default { key: 'editor', saga: rootSaga };
