import { put } from 'redux-saga/effects';
import { imageLoaded } from './actions';

import _debug from 'debug';
const debug = _debug('lens:image:commands');

function* imageHandler(payload) {
  debug('image command handler', payload);
  const { imageDescriptor, url } = payload;
  yield put(imageLoaded({ imageDescriptor, url} ));
}

export default {
  image: imageHandler
};
