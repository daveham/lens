import { takeEvery, select, all, put } from 'redux-saga/effects';
import { restApiSaga } from 'sagas/utils';
import {
  ensureCatalogTitle,
  requestCatalog,
  receiveCatalog,
  requestCatalogFailed,
} from '../modules/actions';
import {
  catalogName as catalogNameSelector,
  catalogSources as catalogSourcesSelector,
} from '../selectors';
import { setTitle } from 'modules/ui';

// import getDebugLog from '../debugLog';
// const debug = getDebugLog('sagas');

export function* loadCatalogSaga() {
  yield* restApiSaga(['/catalog'], receiveCatalog, requestCatalogFailed);
}

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
    takeEvery(requestCatalog, loadCatalogSaga),
    takeEvery(ensureCatalogTitle, ensureTitleSaga),

    // TODO: ensure images based on ACTIONS.REQUEST_IMAGE (disambiguate catalog ACTIONS from image ACTIONS
    // takeEvery(ACTIONS.REQUEST_IMAGE, ensureImage) - parameter of imageDescriptor flows through?
  ]);
}

export default { key: 'catalog', saga: rootSaga };
