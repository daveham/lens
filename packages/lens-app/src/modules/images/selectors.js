import { makeImageKey, makeThumbnailImageDescriptor } from '@lens/image-descriptors';

export const IMAGE_LIST_KEYS = {
  DEFAULT: 'images',
  THUMBNAILS: 'thumbnails',
};

export const thumbnailsListKey = () => IMAGE_LIST_KEYS.THUMBNAILS;
export const tilesListKey = (id, group) => `${IMAGE_LIST_KEYS.DEFAULT}/${id}/${group}`;

export const listKeyFromImageDescriptor = ({ input, output }) => {
  if (output && output.purpose === 't') {
    return thumbnailsListKey();
  }
  const { id, group } = input;
  return tilesListKey(id, group);
};

const thumbnailUrlFromImage = image => {
  return image && !image.loading ? image.url : null;
};

const emptyObject = {};
const emptyArray = [];
export const thumbnailUrlFromKeySelector = ({ images }, key) => {
  const thumbnailByKeys = images.byKeys[thumbnailsListKey()] || emptyObject;
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
  const thumbnailKeys = keys[thumbnailsListKey()] || emptyArray;
  const thumbnailByKeys = byKeys[thumbnailsListKey()] || emptyObject;
  return thumbnailKeys.length
    ? thumbnailKeys.map(key => thumbnailUrlFromImage(thumbnailByKeys[key]))
    : emptyArray;
};

export const thumbnailImagesSelector = ({ images }) => {
  return images.byKeys[thumbnailsListKey()] || emptyObject;
};

export const tileImagesSelector = ({ images }, id, group) => {
  return images.byKeys[tilesListKey(id, group)] || emptyObject;
};

export const imageSelector = (state, imageDescriptor) => {
  const listKey = listKeyFromImageDescriptor(imageDescriptor);
  const byKeys = state.images.byKeys[listKey] || emptyObject;
  const key = makeImageKey(imageDescriptor);
  return byKeys[key];
};

export const imageDescriptorsNotLoadedSelector = (state, imageDescriptors) => {
  if (imageDescriptors.length) {
    const firstDescriptor = imageDescriptors[0];
    const firstKey = listKeyFromImageDescriptor(firstDescriptor);
    const byKeys = state.images.byKeys[firstKey] || emptyObject;

    return imageDescriptors.filter(imageDescriptor => {
      const key = makeImageKey(imageDescriptor);
      const image = byKeys[key];
      return !(image && image.url);
    });
  }
  return imageDescriptors;
};
