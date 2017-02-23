import { makeImageId } from '@lens/image-descriptors';
import { ACTIONS } from './constants';

const imageLoadedReducer = (state = {}, url) => {
  // add the url to the image object and reset the loading flag
  return {
    ...state,
    url,
    loading: false
  };
};

const imageLoadingReducer = (state = {}, loading) => {
  // set the loading flag
  return {
    ...state,
    loading
  };
};

const imageReducer = (state = {}, { type, payload }) => {
  switch (type) {
    case ACTIONS.REQUEST_IMAGE: {
      // payload is the image descriptor; set the loading flag
      const id = makeImageId(payload);
      return {
        ...state,
        [id]: imageLoadingReducer(state[id], true)
      };
    }

    case ACTIONS.CLEAR_REQUEST_IMAGE: {
      // payload is the image descriptor, reset the loading flag
      const id = makeImageId(payload);
      return {
        ...state,
        [id]: imageLoadingReducer(state[id], false)
      };
    }

    case ACTIONS.RECEIVE_IMAGE: {
      const { imageDescriptor, url } = payload;
      const id = makeImageId(imageDescriptor);
      return {
        ...state,
        [id]: imageLoadedReducer(state[id], url)
      };
    }

    default:
      return state;
  }
};

export default {
  images: imageReducer
};
