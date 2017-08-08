import { takeEvery, all } from 'redux-saga/effects';
import { invokeRestService, apiSaga } from '../../../sagas';
import { ACTIONS, receiveCatalog, requestCatalogFailed } from '../modules';

export function* loadCatalog() {
  yield* apiSaga(invokeRestService, [ '/catalog' ], receiveCatalog, requestCatalogFailed);
}

export function* rootSaga() {
  yield all([
    takeEvery(ACTIONS.REQUEST_CATALOG, loadCatalog)
  ]);
}

export default { key: 'catalog', saga: rootSaga };
