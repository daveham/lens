import { ACTIONS } from './constants';

// reducer
export default (state = {}, action) => {
  switch (action.type) {
    case ACTIONS.REQUEST_SOURCE_THUMBS:
      return {
        ...state,
        loading: true
      };

    case ACTIONS.REQUEST_SOURCE_THUMBS_FAILED:
      return {
        ...state,
        loading: false
      };

    case ACTIONS.RECEIVE_SOURCE_THUMBS: {
      const newState = {...state, loading: false };
      action.payload.forEach((item) => { newState[item] = 'ready'; });
      return newState;
    }

    case ACTIONS.GENERATE_SOURCE_THUMB:
      return {
        ...state,
        [action.payload.id]: 'busy'
      };

    case ACTIONS.SOURCE_THUMB_GENERATED:
      return {
        ...state,
        [action.payload.id]: 'ready'
      };

    case ACTIONS.GENERATE_SOURCE_THUMB_FAILED: {
      const newState = { ...state };
      delete newState[action.payload.id];
      return newState;
    }

    default:
      return state;
  }
};
