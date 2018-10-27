import { takeEvery, select, all, put } from 'redux-saga/effects';
import { invokeRestService, apiSaga } from 'sagas/utils';
import { ACTIONS, receiveCatalog, requestCatalogFailed } from '../modules/actions';
import {
  catalogName as catalogNameSelector,
  catalogSources as catalogSourcesSelector,
} from '../selectors';
import { setTitle } from 'modules/ui';

// import _debug from 'debug';
// const debug = _debug('lens:catalog:sagas');

export function* loadCatalogSaga() {
  yield* apiSaga(invokeRestService, [ '/catalog' ], receiveCatalog, requestCatalogFailed);
}

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
    takeEvery(ACTIONS.REQUEST_CATALOG, loadCatalogSaga),
    takeEvery(ACTIONS.ENSURE_CATALOG_TITLE, ensureTitleSaga),

    // TODO: ensure images based on ACTIONS.REQUEST_IMAGE (disambiguate catalog ACTIONS from image ACTIONS
    // takeEvery(ACTIONS.REQUEST_IMAGE, ensureImage) - parameter of imageDescriptor flows through?
  ]);
}

export default { key: 'catalog', saga: rootSaga };
