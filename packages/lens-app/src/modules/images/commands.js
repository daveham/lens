import { put } from 'redux-saga/effects';
import { imageLoaded } from './actions';

import getDebugLog from './debugLog';
const debug = getDebugLog('images');

function* imageHandler(payload) {
  debug('image command handler', payload);
  const { imageDescriptor, result: { url } } = payload;
  yield put(imageLoaded({ imageDescriptor, data: { url } } ));
}

export default {
  image: imageHandler
};
