import { makeImageKey } from '@lens/image-descriptors';
import {
  itemLoadedWithUrlReducer,
  itemsLoadedWithUrlReducer,
  itemLoadingReducer,
  itemsLoadingReducer,
  addOrUpdateItem,
  addOrUpdateItems
} from '../utils';
import { ACTIONS } from './actions';

const imageLoadingHandler = (state, { listKey, imageDescriptor }) => {
  const key = makeImageKey(imageDescriptor);
  const imageReducerFn = (item) => itemLoadingReducer(item, true);
  return addOrUpdateItem(state, listKey, key, imageReducerFn);
};

const imageNotLoadingHandler = (state, { listKey, imageDescriptor }) => {
  const key = makeImageKey(imageDescriptor);
  const imageReducerFn = (item) => itemLoadingReducer(item, false);
  return addOrUpdateItem(state, listKey, key, imageReducerFn);
};

const imageLoadedHandler = (state, { listKey, imageDescriptor, url }) => {
  const key = makeImageKey(imageDescriptor);
  const imageReducerFn = (item) => itemLoadedWithUrlReducer(item, url);
  return addOrUpdateItem(state, listKey, key, imageReducerFn);
};

const imagesLoadingHandler = (state, { listKey, imageDescriptors }) => {
  const keys = imageDescriptors.map((imageDescriptor) => makeImageKey(imageDescriptor));
  const imageReducerFn = (items) => itemsLoadingReducer(items, true);
  return addOrUpdateItems(state, listKey, keys, imageReducerFn);
};

const imagesNotLoadingHandler = (state, { listKey, imageDescriptors }) => {
  const keys = imageDescriptors.map((imageDescriptor) => makeImageKey(imageDescriptor));
  const imageReducerFn = (items) => itemsLoadingReducer(items, false);
  return addOrUpdateItems(state, listKey, keys, imageReducerFn);
};

const imagesLoadedHandler = (state, { listKey, imageDescriptors, urls }) => {
  const keys = imageDescriptors.map((imageDescriptor) => makeImageKey(imageDescriptor));
  const imageReducerFn = (items) => itemsLoadedWithUrlReducer(items, urls);
  return addOrUpdateItems(state, listKey, keys, imageReducerFn);
};

const initialState = {
  keys: {},
  byKeys: {}
};

const imageActionHandlers = {};
const defaultHandler = (state) => state;
imageActionHandlers[ACTIONS.IMAGE_LOADING] = imageLoadingHandler;
imageActionHandlers[ACTIONS.IMAGE_NOT_LOADING] = imageNotLoadingHandler;
imageActionHandlers[ACTIONS.IMAGE_LOADED] = imageLoadedHandler;
imageActionHandlers[ACTIONS.IMAGES_LOADING] = imagesLoadingHandler;
imageActionHandlers[ACTIONS.IMAGES_NOT_LOADING] = imagesNotLoadingHandler;
imageActionHandlers[ACTIONS.IMAGES_LOADED] = imagesLoadedHandler;
const getActionHandler = (type) => imageActionHandlers[type] || defaultHandler;

const imagesReducer = (state = initialState, action) => {
  if (action) {
    const { type, payload } = action;
    return getActionHandler(type)(state, payload);
  }
  return state;
};

export default imagesReducer;
