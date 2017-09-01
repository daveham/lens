//import { combineReducers } from 'redux';
import { createAction } from 'redux-actions';
import { makeImageKey } from '@lens/image-descriptors';

export const ACTIONS = {
  REQUEST_IMAGE: 'REQUEST_IMAGE',
  CLEAR_REQUEST_IMAGE: 'CLEAR_REQUEST_IMAGE',
  RECEIVE_IMAGE: 'RECEIVE_IMAGE',
};

export const requestImageAction = createAction(ACTIONS.REQUEST_IMAGE/* , actionPayloadFromImageDescriptor */);
export const clearRequestImageAction = createAction(ACTIONS.CLEAR_REQUEST_IMAGE/* , actionPayloadFromImageDescriptor */);
export const receiveImageAction = createAction(ACTIONS.RECEIVE_IMAGE/* , actionPayloadFromImageDescriptor*/);


const imageLoadedReducer = (state = {}, url) => {
  // add the url to the image object and reset the loading flag
  return {
    ...state,
    url,
    loading: false
  };
};

const imageLoadingReducer = (state = {}, loading) => {
  // set or reset the loading flag
  return {
    ...state,
    loading
  };
};

const imageKeysReducer = (state = [], key) => {
  // add a key to the list of keys
  return [
    ...state,
    key
  ];
};

const imageByKeysReducer = (state = {}, key, image) => {
  // add the image
  return {
    ...state,
    [key]: image
  };
};

const requestImageHandler = (state, { listKey, imageDescriptor }) => {
  const key = makeImageKey(imageDescriptor);

  const existingKeys = state.keys[listKey] || [];
  const existingByKeys = state.byKeys[listKey] || {};
  const existingItem = existingByKeys[key];

  const keys = existingItem ? state.keys : {
    ...state.keys,
    [listKey]: imageKeysReducer(existingKeys, key)
  };
  const byKeys = {
    ...state.byKeys,
    [listKey]: imageByKeysReducer(existingByKeys, key, imageLoadingReducer(existingItem, true))
  };

  return {
    ...state,
    keys,
    byKeys
  };
};

const initialState = {
  keys: {},
  byKeys: {}
};

const imageActionHandlers = {};
const defaultHandler = (state) => state;
imageActionHandlers[ACTIONS.REQUEST_IMAGE] = requestImageHandler;
imageActionHandlers[ACTIONS.CLEAR_REQUEST_IMAGE] = defaultHandler;
imageActionHandlers[ACTIONS.RECEIVE_IMAGE] = defaultHandler;
const getActionHandler = (type) => imageActionHandlers[type] || defaultHandler;

const imagesReducer = (state = initialState, action) => {
  if (action) {
    const { type, payload } = action;
    return getActionHandler(type)(state, payload);
  }
  return state;
};

export default imagesReducer;
