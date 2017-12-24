import { makeImageKey } from '@lens/image-descriptors';
import {
  itemLoadedReducer,
  itemsLoadedReducer,
  itemLoadingReducer,
  itemsLoadingReducer,
  addOrUpdateItem,
  addOrUpdateItems
} from '../utils';
import { ACTIONS } from './actions';

const imageLoadingHandler = (state, { listKey, imageDescriptor, data }) => {
  const key = makeImageKey(imageDescriptor);
  const imageReducerFn = (item) => itemLoadingReducer(item, data, true);
  return addOrUpdateItem(state, listKey, key, imageReducerFn);
};

const imageNotLoadingHandler = (state, { listKey, imageDescriptor, data }) => {
  const key = makeImageKey(imageDescriptor);
  const imageReducerFn = (item) => itemLoadingReducer(item, data, false);
  return addOrUpdateItem(state, listKey, key, imageReducerFn);
};

const imageLoadedHandler = (state, { listKey, imageDescriptor, data }) => {
  const key = makeImageKey(imageDescriptor);
  const imageReducerFn = (item) => itemLoadedReducer(item, data);
  return addOrUpdateItem(state, listKey, key, imageReducerFn);
};

const augmentedData = (data, imageDescriptors) => {
  // if imageDescriptors include location, fold into data as x, y
  return imageDescriptors.map((imageDescriptor, index) => {
    const dataItem = data[index] || {};
    const { location } = imageDescriptor.input;
    if (location) {
      dataItem.x = location.x;
      dataItem.y = location.y;
    }
    return dataItem;
  });
};

const imagesLoadingHandler = (state, { listKey, imageDescriptors, data = [] }) => {
  const newData = augmentedData(data, imageDescriptors);
  const keys = imageDescriptors.map((imageDescriptor) => makeImageKey(imageDescriptor));
  const imageReducerFn = (items) => itemsLoadingReducer(items, newData, true);
  return addOrUpdateItems(state, listKey, keys, imageReducerFn);
};

const imagesNotLoadingHandler = (state, { listKey, imageDescriptors, data = [] }) => {
  const newData = augmentedData(data, imageDescriptors);
  const keys = imageDescriptors.map((imageDescriptor) => makeImageKey(imageDescriptor));
  const imageReducerFn = (items) => itemsLoadingReducer(items, newData, false);
  return addOrUpdateItems(state, listKey, keys, imageReducerFn);
};

const imagesLoadedHandler = (state, { listKey, imageDescriptors, data = [] }) => {
  const newData = augmentedData(data, imageDescriptors);
  const keys = imageDescriptors.map((imageDescriptor) => makeImageKey(imageDescriptor));
  const imageReducerFn = (items) => itemsLoadedReducer(items, newData);
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
