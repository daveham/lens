import { takeEvery, select, all, put } from 'redux-saga/effects';
import { ACTIONS } from '../modules/constants';
import {
  catalogName as catalogNameSelector,
  catalogSources as catalogSourcesSelector,
} from 'containers/catalog/selectors';
import { setTitle } from 'modules/ui';

// import _debug from 'debug';
// const debug = _debug('lens:editor:sagas');

export function* ensureTitleSaga({ payload }) {
  const catalogName = yield select(catalogNameSelector);
  if (payload) {
    const catalogSources = yield select(catalogSourcesSelector);
    const sourceName = catalogSources.byIds[payload].name;
    yield put(setTitle(`${catalogName} - ${sourceName}`));
  } else {
    yield put(setTitle(catalogName));
  }
}

export function* rootSaga() {
  yield all([
    takeEvery(ACTIONS.ENSURE_EDITOR_TITLE, ensureTitleSaga),
  ]);
}

export default { key: 'editor', saga: rootSaga };
