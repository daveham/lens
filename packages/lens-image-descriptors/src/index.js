import path from 'path';
import config from './config';

/* format of image descriptor is
  {
    source: {
      id - catalog source image
      location - x,y position in source image
      size - size from source image
    },
    purpose: {
      category: ui, stats, render, etc
      element: thumb, etc
    },
    output: {
      size - size of output
      id - used for naming output
    }
  }
*/

// an image id is used as a key into an image cache
export const makeImageId = (imageDescriptor) => {
  const { source, purpose } = imageDescriptor;
  if (purpose) {
    return `${source.id}_${purpose.element}_${purpose.category}`;
  }

  return source.id;
};

export const makeThumbImageDescriptor = (id, file) => {
  return {
    purpose: {
      category: 'u', // UI
      element: 't' // thumbnail
    },
    source: { id, file }
  };
};

const thumbnailFileName = (id) => {
  return `${id}_thumb.jpg`;
};

// return where the file would be found if the image file exists
export const pathFromImageDescriptor = (imageDescriptor) => {
  const { source, purpose } = imageDescriptor;
  if (purpose.category === 'u') {
    if (purpose.element === 't') {
      return config.utils_paths.thumbs(thumbnailFileName(source.id));
    }
  }
};

// return ulr to reference image through web server
export const urlFromImageDescriptor = (imageDescriptor) => {
  const { source, purpose } = imageDescriptor;
  if (purpose.category === 'u') {
    if (purpose.element === 't') {
      return path.join(config.dir_thumbs, thumbnailFileName(source.id));
    }
  }
};

/* format of stats descriptor is
  {
    source: {
      id - catalog source image
      location - x,y position in source image
      size - size from source image
    },
    purpose: identify, etc
  }
*/

export const makeSourceStatsDescriptor = (imageDescriptor) => {
  return {
    analysis: 'i', // identify
    imageDescriptor
  };
};

// an image id is used as a key into an image cache
export const makeStatsId = (statsDescriptor) => {
  const { analysis, imageDescriptor } = statsDescriptor;
  if (analysis) {
    return `${analysis}_${makeImageId(imageDescriptor)}`;
  }

  return makeImageId(imageDescriptor);
};

