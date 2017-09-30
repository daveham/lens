import { createAction } from 'redux-actions';
import { makeImageKey } from '@lens/image-descriptors';
import {
  itemLoadedReducer,
  itemLoadingReducer,
  addOrUpdateItem
} from '../utils';

import debugLib from 'debug';
const debug = debugLib('lens:modules:images');


export const ACTIONS = {
  IMAGE_LOADING: 'IMAGE_LOADING',
  IMAGE_NOT_LOADING: 'IMAGE_NOT_LOADING',
  IMAGE_LOADED: 'IMAGE_LOADED',
};

export const IMAGE_LIST_KEYS = {
  DEFAULT: 'images',
  THUMBNAILS: 'thumbnails'
};

// action creators
export const listKeyFromImageDescriptor = imageDescriptor => {
  debug('listKeyFromImageDescriptor', imageDescriptor);
  if (imageDescriptor && imageDescriptor.output && imageDescriptor.output.purpose === 't') {
    return IMAGE_LIST_KEYS.THUMBNAILS;
  }
  return IMAGE_LIST_KEYS.DEFAULT;
};

const actionPayloadFromImageDescriptor = payload => {
  return {
    ...payload,
    listKey: listKeyFromImageDescriptor(payload.imageDescriptor)
  };
};

export const imageLoading = createAction(ACTIONS.IMAGE_LOADING, actionPayloadFromImageDescriptor);
export const imageNotLoading = createAction(ACTIONS.IMAGE_NOT_LOADING, actionPayloadFromImageDescriptor);
export const imageLoaded = createAction(ACTIONS.IMAGE_LOADED, actionPayloadFromImageDescriptor);


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
  const imageReducerFn = (item) => itemLoadedReducer(item, url);
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
