import { makeImageKey } from '@lens/image-descriptors';
import { listKeyFromImageDescriptor } from './actions';

export const IMAGE_LIST_KEYS = {
  DEFAULT: 'images',
  THUMBNAILS: 'thumbnails'
};

const thumbnailUrlFromImage = image => {
  return (image && !image.loading) ? image.url : null;
};

export const thumbnailUrlsSelector = ({ images }) => {
  const { keys, byKeys } = images;
  const thumbnailKeys = keys[IMAGE_LIST_KEYS.THUMBNAILS] || [];
  const thumbnailByKeys = byKeys[IMAGE_LIST_KEYS.THUMBNAILS] || {};
  return thumbnailKeys.map(key => thumbnailUrlFromImage(thumbnailByKeys[key]));
};

export const imageSelector = (state, imageDescriptor) => {
  const listKey = listKeyFromImageDescriptor(imageDescriptor);
  const byKeys = state.images.byKeys[listKey] || {};
  const key = makeImageKey(imageDescriptor);
  return byKeys[key];
};
