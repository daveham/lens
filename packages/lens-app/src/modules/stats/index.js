import { handleActions } from 'redux-actions';
import { makeStatsKey } from '@lens/image-descriptors';
import { itemLoadedReducer, itemLoadingReducer, addOrUpdateItem } from '../utils';
import { statsLoading, statsNotLoading, statsLoaded } from './actions';

const initialState = {
  keys: {},
  byKeys: {},
};

const statsReducerHelper = (state, listKey, statsDescriptor, statsReducerFn) => {
  const key = makeStatsKey(statsDescriptor);
  return addOrUpdateItem(state, listKey, key, statsReducerFn);
};

const statsReducer = handleActions(
  {
    [statsLoading]: (state, { payload: { listKey, statsDescriptor, data } }) =>
      statsReducerHelper(state, listKey, statsDescriptor, item => itemLoadingReducer(item, data, true)),
    [statsNotLoading]: (state, { payload: { listKey, statsDescriptor, data } }) =>
      statsReducerHelper(state, listKey, statsDescriptor, item => itemLoadingReducer(item, data, false)),
    [statsLoaded]: (state, { payload: { listKey, statsDescriptor, data } }) =>
      statsReducerHelper(state, listKey, statsDescriptor, item => itemLoadedReducer(item, { data })),
  },
  initialState,
);

export default statsReducer;
