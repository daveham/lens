import { takeEvery, select, all, call, put } from 'redux-saga/effects';
import { invokeRestService } from './utils';
import { clientIdSelector } from './socket';
import {
  ACTIONS,
  imageLoading,
  imageLoaded,
  imageNotLoading
} from '../modules/images/actions';
import { imageSelector } from '../modules/images/selectors';

import _debug from 'debug';
const debug = _debug('lens:saga:image');

export function* ensureImageSaga({ payload }) {
  const { imageDescriptor, force } = payload;
  const image = yield select(imageSelector, imageDescriptor);
  const notNeeded = image && (image.url && !force);
  if (notNeeded) {
    return;
  }

  yield put(imageLoading({ imageDescriptor }));
  const clientId = yield select(clientIdSelector);
  try {
    const body = { clientId, imageDescriptor };
    const payload = yield call(invokeRestService, '/image', { method: 'POST', body });
    // TODO
    const { url } = payload;
    if (url) {
      // debug('image api returned url', url);
      yield put(imageLoaded({ imageDescriptor, url} ));
    // } else {
    //   debug('image api did not return url');
    //   // TODO: replace this with no-op since job should be enqueued
    //   yield put(imageNotLoading({ imageDescriptor }));
    }
  } catch (error) {
    debug('image api exception', error);
    yield put(imageNotLoading({ imageDescriptor }));
  }
}

export default function* imagesSaga() {
  yield all([
    takeEvery(ACTIONS.IMAGE_ENSURE, ensureImageSaga)
  ]);
}
