import {
  makeImageKey,
  makeThumbnailImageDescriptor
} from '@lens/image-descriptors';

export const IMAGE_LIST_KEYS = {
  DEFAULT: 'images',
  THUMBNAILS: 'thumbnails'
};

export const listKeyFromImageDescriptor = imageDescriptor => {
  if (imageDescriptor && imageDescriptor.output && imageDescriptor.output.purpose === 't') {
    return IMAGE_LIST_KEYS.THUMBNAILS;
  }
  return IMAGE_LIST_KEYS.DEFAULT;
};

const thumbnailUrlFromImage = image => {
  return (image && !image.loading) ? image.url : null;
};

export const thumbnailUrlFromKeySelector = ({ images }, key) => {
  const thumbnailByKeys = images.byKeys[IMAGE_LIST_KEYS.THUMBNAILS] || {};
  const image = thumbnailByKeys[key];
  return thumbnailUrlFromImage(image);
};

export const thumbnailUrlFromIdSelector = (state, id) => {
  const imageDescriptor = makeThumbnailImageDescriptor(id);
  const key = makeImageKey(imageDescriptor);
  return thumbnailUrlFromKeySelector(state, key);
};

export const thumbnailUrlsSelector = ({ images }) => {
  const { keys, byKeys } = images;
  const thumbnailKeys = keys[IMAGE_LIST_KEYS.THUMBNAILS] || [];
  const thumbnailByKeys = byKeys[IMAGE_LIST_KEYS.THUMBNAILS] || {};
  return thumbnailKeys.map(key => thumbnailUrlFromImage(thumbnailByKeys[key]));
};

export const thumbnailImages = ({ images }) => {
  return images.byKeys[IMAGE_LIST_KEYS.THUMBNAILS] || {};
};

export const imageSelector = (state, imageDescriptor) => {
  const listKey = listKeyFromImageDescriptor(imageDescriptor);
  const byKeys = state.images.byKeys[listKey] || {};
  const key = makeImageKey(imageDescriptor);
  return byKeys[key];
};

export const imageDescriptorsNotLoadedSelector = (state, imageDescriptors) => {
  if (imageDescriptors.length) {
    const firstDescriptor = imageDescriptors[0];
    const firstKey = listKeyFromImageDescriptor(firstDescriptor);
    const byKeys = state.images.byKeys[firstKey] || {};

    return imageDescriptors.filter((imageDescriptor) => {
      const key = makeImageKey(imageDescriptor);
      const image = byKeys[key];
      return !(image && image.url);
    });
  }
  return imageDescriptors;
};
