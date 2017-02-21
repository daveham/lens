import { makeStatsId } from '@lens/image-descriptors';
import { ACTIONS } from './constants';

// reducers
const statsReducer = (state = {}, data) => {
  // add the url to the image object and reset the loading flag
  return {
    ...state,
    data,
    loading: false
  };
};

const statsLoadingReducer = (state = {}, loading) => {
  // set the loading flag
  return {
    ...state,
    loading
  };
};

export default (state = {}, { type, payload }) => {
  switch (type) {
    case ACTIONS.REQUEST_STATS: {
      // payload is the stats descriptor; set the loading flag
      const id = makeStatsId(payload);
      return {
        ...state,
        [id]: statsLoadingReducer(state[id], true)
      };
    }

    case ACTIONS.CLEAR_REQUEST_STATS: {
      // payload is the stats descriptor, reset the loading flag
      const id = makeStatsId(payload);
      return {
        ...state,
        [id]: statsLoadingReducer(state[id], false)
      };
    }

    case ACTIONS.RECEIVE_STATS: {
      const { statsDescriptor, data } = payload;
      const id = makeStatsId(statsDescriptor);
      return {
        ...state,
        [id]: statsReducer(state[id], data)
      };
    }

    default:
      return state;
  }
};
