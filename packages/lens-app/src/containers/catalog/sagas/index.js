import { takeEvery, all, select } from 'redux-saga/effects';
import { invokeRestService, apiSaga } from '../../../sagas/utils';
import { ACTIONS, receiveCatalog, requestCatalogFailed } from '../modules';
import { listKeyFromImageDescriptor } from '../modules/images';
import { makeImageKey } from '@lens/image-descriptors';

const imageSelector = (state, imageDescriptor) => {
  const listKey = listKeyFromImageDescriptor(imageDescriptor);
  const byKeys = state.images.byKeys[listKey] || {};
  const key = makeImageKey(imageDescriptor);
  return byKeys[key];
};

export function* ensureImage(imageDescriptor, force) {
  const image = yield select(imageSelector, imageDescriptor);
  const notNeeded = image && (image.loading || (image.url && !force));
  if (notNeeded) return;

  yield* apiSaga(invokeRestService,
    [ '/api/images/', { method: 'POST' } ],
    receiveCatalog, // TODO
    requestCatalogFailed // TODO
    );

}

export function* loadCatalog() {
  yield* apiSaga(invokeRestService, [ '/catalog' ], receiveCatalog, requestCatalogFailed);
}

export function* rootSaga() {
  yield all([
    takeEvery(ACTIONS.REQUEST_CATALOG, loadCatalog)
  ]);
}

export default { key: 'catalog', saga: rootSaga };
