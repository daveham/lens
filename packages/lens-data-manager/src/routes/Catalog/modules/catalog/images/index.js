import { makeImageKey } from '@lens/image-descriptors';
import { ACTIONS } from '../constants';

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

const initialState = {
  keys: {},
  byKeys: {}
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

const clearRequestImageHandler = (state, { listKey, imageDescriptor }) => {
  const key = makeImageKey(imageDescriptor);

  const existingByKeys = state.byKeys[listKey];
  const existingItem = existingByKeys[key];

  const byKeys = {
    ...state.byKeys,
    [listKey]: imageByKeysReducer(existingByKeys, key, imageLoadingReducer(existingItem, false))
  };

  return {
    ...state,
    byKeys
  };
};

const receiveImageHandler = (state, { listKey, imageDescriptor, url }) => {
  const key = makeImageKey(imageDescriptor);

  const existingByKeys = state.byKeys[listKey];
  const existingItem = existingByKeys[key];

  const byKeys = {
    ...state.byKeys,
    [listKey]: imageByKeysReducer(existingByKeys, key, imageLoadedReducer(existingItem, url))
  };

  return {
    ...state,
    byKeys
  };
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case ACTIONS.REQUEST_IMAGE:
      return requestImageHandler(state, payload);
    case ACTIONS.CLEAR_REQUEST_IMAGE:
      return clearRequestImageHandler(state, payload);
    case ACTIONS.RECEIVE_IMAGE:
      return receiveImageHandler(state, payload);

    default:
      return state;
  }
};
