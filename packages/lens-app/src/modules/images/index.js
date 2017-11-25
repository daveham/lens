import { makeImageKey } from '@lens/image-descriptors';
import {
  itemLoadedWithUrlReducer,
  itemLoadingReducer,
  addOrUpdateItem
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

const initialState = {
  keys: {},
  byKeys: {}
};

const imageActionHandlers = {};
const defaultHandler = (state) => state;
imageActionHandlers[ACTIONS.IMAGE_LOADING] = imageLoadingHandler;
imageActionHandlers[ACTIONS.IMAGE_NOT_LOADING] = imageNotLoadingHandler;
imageActionHandlers[ACTIONS.IMAGE_LOADED] = imageLoadedHandler;
const getActionHandler = (type) => imageActionHandlers[type] || defaultHandler;

const imagesReducer = (state = initialState, action) => {
  if (action) {
    const { type, payload } = action;
    return getActionHandler(type)(state, payload);
  }
  return state;
};

export default imagesReducer;
