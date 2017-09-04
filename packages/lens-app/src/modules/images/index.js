//import { combineReducers } from 'redux';
import { createAction } from 'redux-actions';
import { makeImageKey } from '@lens/image-descriptors';
import {
  itemLoadedReducer,
  itemLoadingReducer,
  addOrUpdateItem
} from '../utils';

export const ACTIONS = {
  REQUEST_IMAGE: 'REQUEST_IMAGE',
  CLEAR_REQUEST_IMAGE: 'CLEAR_REQUEST_IMAGE',
  RECEIVE_IMAGE: 'RECEIVE_IMAGE',
};

export const requestImageAction = createAction(ACTIONS.REQUEST_IMAGE/* , actionPayloadFromImageDescriptor */);
export const clearRequestImageAction = createAction(ACTIONS.CLEAR_REQUEST_IMAGE/* , actionPayloadFromImageDescriptor */);
export const receiveImageAction = createAction(ACTIONS.RECEIVE_IMAGE/* , actionPayloadFromImageDescriptor*/);


const requestImageHandler = (state, { listKey, imageDescriptor }) => {
  const key = makeImageKey(imageDescriptor);
  const imageReducerFn = (item) => itemLoadingReducer(item, true);
  return addOrUpdateItem(state, listKey, key, imageReducerFn);
};

const clearRequestImageHandler = (state, { listKey, imageDescriptor }) => {
  const key = makeImageKey(imageDescriptor);
  const imageReducerFn = (item) => itemLoadingReducer(item, false);
  return addOrUpdateItem(state, listKey, key, imageReducerFn);
};

const receiveImageHandler = (state, { listKey, imageDescriptor, url }) => {
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
imageActionHandlers[ACTIONS.REQUEST_IMAGE] = requestImageHandler;
imageActionHandlers[ACTIONS.CLEAR_REQUEST_IMAGE] = clearRequestImageHandler;
imageActionHandlers[ACTIONS.RECEIVE_IMAGE] = receiveImageHandler;
const getActionHandler = (type) => imageActionHandlers[type] || defaultHandler;

const imagesReducer = (state = initialState, action) => {
  if (action) {
    const { type, payload } = action;
    return getActionHandler(type)(state, payload);
  }
  return state;
};

export default imagesReducer;
