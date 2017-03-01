import { makeImageId } from '@lens/image-descriptors';
import { ACTIONS } from './constants';
import debugLib from 'debug';
const debug = debugLib('app:module:catalog-images-reducers');

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

const imageIdsReducer = (state = [], id) => {
  // add an id to the list of ids
  return [
    ...state,
    id
  ];
};

const imageByIdsReducer = (state = {}, id, image) => {
  // add the image
  return {
    ...state,
    [id]: image
  };
};

const initialState = {
  ids: {},
  byIds: {}
};

const requestImageHandler = (state, { imageDescriptor, listKey }) => {
  const id = makeImageId(imageDescriptor);

  const existingIds = state.ids[listKey] || [];
  const existingByIds = state.byIds[listKey] || {};
  const existingItem = existingByIds[id];

  const ids = existingItem ? state.ids : {
    ...state.ids,
    [listKey]: imageIdsReducer(existingIds, id)
  };
  const byIds = {
    ...state.byIds,
    [listKey]: imageByIdsReducer(existingByIds, id, imageLoadingReducer(existingItem, true))
  };

  return {
    ...state,
    ids,
    byIds
  };
};

const clearRequestImageHandler = (state, { imageDescriptor, listKey }) => {
  const id = makeImageId(imageDescriptor);

  const existingByIds = state.byIds[listKey];
  const existingItem = existingByIds[id];

  const byIds = {
    ...state.byIds,
    [listKey]: imageByIdsReducer(existingByIds, id, imageLoadingReducer(existingItem, false))
  };

  return {
    ...state,
    byIds
  };
};

const receiveImageHandler = (state, { imageDescriptor, url, listKey }) => {
  const id = makeImageId(imageDescriptor);

  const existingByIds = state.byIds[listKey];
  const existingItem = existingByIds[id];

  const byIds = {
    ...state.byIds,
    [listKey]: imageByIdsReducer(existingByIds, id, imageLoadedReducer(existingItem, url))
  };

  return {
    ...state,
    byIds
  };
};

export default (state = initialState, { type, payload }) => {
  debug('reducer', { type, payload });
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