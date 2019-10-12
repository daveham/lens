import { handleActions } from 'redux-actions';
import { makeImageKey } from '@lens/image-descriptors';
import {
  itemLoadedReducer,
  itemsLoadedReducer,
  itemLoadingReducer,
  itemsLoadingReducer,
  addOrUpdateItem,
  addOrUpdateItems,
} from '../utils';
import {
  imageLoading,
  imageNotLoading,
  imageLoaded,
  imagesLoading,
  imagesNotLoading,
  imagesLoaded,
} from './actions';

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

const imageReducerHelper = (state, listKey, imageDescriptor, imageReducerFn) => {
  const key = makeImageKey(imageDescriptor);
  return addOrUpdateItem(state, listKey, key, imageReducerFn);
};

const imagesReducerHelper = (state, listKey, imageDescriptors, imagesReducerFn) => {
  const keys = imageDescriptors.map(imageDescriptor => makeImageKey(imageDescriptor));
  return addOrUpdateItems(state, listKey, keys, imagesReducerFn);
};

const initialState = {
  keys: {},
  byKeys: {},
};

const imagesReducer = handleActions(
  {
    [imageLoading]: (state, { payload: { listKey, imageDescriptor, data } }) =>
      imageReducerHelper(state, listKey, imageDescriptor, item => itemLoadingReducer(item, data, true)),
    [imageNotLoading]: (state, { payload: { listKey, imageDescriptor, data } }) =>
      imageReducerHelper(state, listKey, imageDescriptor, item => itemLoadingReducer(item, data, false)),
    [imageLoaded]: (state, { payload: { listKey, imageDescriptor, data } }) =>
      imageReducerHelper(state, listKey, imageDescriptor, item => itemLoadedReducer(item, data)),
    [imagesLoading]: (state, { payload: { listKey, imageDescriptors, data = [] } }) =>
      imagesReducerHelper(state, listKey, imageDescriptors, items =>
        itemsLoadingReducer(items, augmentedData(data, imageDescriptors), true)),
    [imagesNotLoading]: (state, { payload: { listKey, imageDescriptors, data = [] } }) =>
      imagesReducerHelper(state, listKey, imageDescriptors, items =>
        itemsLoadingReducer(items, augmentedData(data, imageDescriptors), false)),
    [imagesLoaded]: (state, { payload: { listKey, imageDescriptors, data = [] } }) =>
      imagesReducerHelper(state, listKey, imageDescriptors, items =>
        itemsLoadedReducer(items, augmentedData(data, imageDescriptors))),
  },
  initialState,
);

export default imagesReducer;
