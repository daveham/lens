import { ACTIONS } from './constants';

const objectReducer = (state = {}, { payload }) => {
  return {
    ...state,
    ...payload,
    loading: false
  };
};
const objectLoadingReducer = (state = {}, loading) => {
  return {
    ...state,
    loading
  };
};

// reducer
export default (state = {}, action) => {
  switch (action.type) {
    case ACTIONS.REQUEST_SOURCE_METADATA: {
      const { id } = action.payload;
      return {
        ...state,
        [id]: objectLoadingReducer(state[id], true)
      };
    }

    case ACTIONS.REQUEST_SOURCE_METADATA_FAILED: {
      const { id } = action.payload;
      return {
        ...state,
        [id]: objectLoadingReducer(state[id], false)
      };
    }

    case ACTIONS.RECEIVE_SOURCE_METADATA: {
      const { id } = action.payload;
      return {
        ...state,
        [id]: objectReducer(state[id], action)
      };
    }

    case ACTIONS.REQUEST_SOURCE_METADATA_DELETED: {
      const { id } = action.payload;
      const newState = { ...state };
      delete newState[id];
      return newState;
    }

    default:
      return state;
  }
};
