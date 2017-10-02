import { takeEvery, select, all, call, put } from 'redux-saga/effects';
import { makeImageKey } from '@lens/image-descriptors';
import { invokeRestService } from './utils';
import { clientIdSelector } from './socket';
import { ACTIONS, listKeyFromImageDescriptor, imageLoading } from '../modules/images';

import _debug from 'debug';
const debug = _debug('lens:saga-image');

const imageSelector = (state, imageDescriptor) => {
  const listKey = listKeyFromImageDescriptor(imageDescriptor);
  const byKeys = state.images.byKeys[listKey] || {};
  const key = makeImageKey(imageDescriptor);
  return byKeys[key];
};

export function* ensureImageSaga({ payload }) {
  debug('ensureImageSaga payload', payload);
  const { imageDescriptor, force } = payload;
  const image = yield select(imageSelector, imageDescriptor);
  const notNeeded = image && (image.url && !force);
  if (notNeeded) {
    debug('not needed', image);
    return;
  }

  yield put(imageLoading({ imageDescriptor }));
  const clientId = yield select(clientIdSelector);
  try {
    const body = { clientId, imageDescriptor };
    const payload = yield call(invokeRestService, '/image', { method: 'POST', body });
    // TODO
    if (payload.url) {
      debug('image api returned url', payload.url);
      // yield put(imageLoaded(imageDescriptor, payload.url));
    } else {
      debug('image api did not return url');
      // yield put(imageLoading(imageDescriptor));
    }
  } catch (error) {
    debug('image api exception', error);
    // yield put(imageNotLoading(imageDescriptor));
  }
}

export default function* imagesSaga() {
  yield all([
    takeEvery(ACTIONS.IMAGE_ENSURE, ensureImageSaga)
  ]);
}

