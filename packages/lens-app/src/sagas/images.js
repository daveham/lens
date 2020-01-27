import { takeEvery, select, all, call, put } from 'redux-saga/effects';
import { invokeRestApiReturnData } from './utils';
import { clientId as clientIdSelector } from '../modules/selectors';
import {
  ensureImage,
  imageLoading,
  imagesLoading,
  imageLoaded,
  ensureImages,
  imagesLoaded,
  imageNotLoading,
  imagesNotLoading,
} from '../modules/images/actions';
import { imageSelector, imageDescriptorsNotLoadedSelector } from '../modules/images/selectors';

import _debug from 'debug';
const debug = _debug('lens:saga:image');

export function* ensureImagesSaga({ payload }) {
  const { imageDescriptors, force } = payload;
  const filteredDescriptors = force
    ? imageDescriptors
    : yield select(imageDescriptorsNotLoadedSelector, imageDescriptors);

  if (filteredDescriptors.length) {
    debug('ensureImagesSaga', { count: filteredDescriptors.length });
    yield put(imagesLoading({ imageDescriptors: filteredDescriptors }));
  }
  const clientId = yield select(clientIdSelector);
  try {
    const body = { clientId, imageDescriptors: filteredDescriptors };
    const payload = yield call(invokeRestApiReturnData, '/image', { method: 'POST', body });
    const { existingUrls, existingImageDescriptors } = payload;
    if (existingUrls && existingUrls.length) {
      yield put(
        imagesLoaded({
          imageDescriptors: existingImageDescriptors,
          data: existingUrls.map(url => ({ url })),
        }),
      );
    }
  } catch (error) {
    debug('ensureImagesSaga image api exception', error);
    yield put(imagesNotLoading({ imageDescriptors: filteredDescriptors }));
  }
}

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
    const payload = yield call(invokeRestApiReturnData, '/image', { method: 'POST', body });
    const { url } = payload;
    if (url) {
      yield put(imageLoaded({ imageDescriptor, data: { url } }));
    }
  } catch (error) {
    debug('ensureImageSaga image api exception', error);
    yield put(imageNotLoading({ imageDescriptor }));
  }
}

export default function* imagesSaga() {
  yield all([takeEvery(ensureImage, ensureImageSaga), takeEvery(ensureImages, ensureImagesSaga)]);
}
