import { takeEvery, all } from 'redux-saga/effects';
import { invokeRestService, apiSaga } from '../../../sagas/utils';
import { ACTIONS, receiveCatalog, requestCatalogFailed } from '../modules';

export function* loadCatalog() {
  yield* apiSaga(invokeRestService, [ '/catalog' ], receiveCatalog, requestCatalogFailed);
}

export function* rootSaga() {
  yield all([
    takeEvery(ACTIONS.REQUEST_CATALOG, loadCatalog)
    // TODO: ensure images based on ACTIONS.REQUEST_IMAGE (disambiguate catalog ACTIONS from image ACTIONS
    // takeEvery(ACTIONS.REQUEST_IMAGE, ensureImage) - parameter of imageDescriptor flows through?
  ]);
}

export default { key: 'catalog', saga: rootSaga };
