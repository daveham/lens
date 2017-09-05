import { select } from 'redux-saga/effects';
import { makeImageKey } from '@lens/image-descriptors';
import { invokeRestService, apiSaga } from './utils';
import {
  receiveImage,
  clearRequestImage,
  listKeyFromImageDescriptor
} from '../modules/images';


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
    receiveImage.bind(null, imageDescriptor), // TODO
    clearRequestImage.bind(null, imageDescriptor) // TODO
  );

}

