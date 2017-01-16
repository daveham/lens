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

export const makeThumbImageDescriptor = (sourceId) => {
  return {
    purpose: {
      category: 'u', // UI
      element: 't' // thumbnail
    },
    source: {
      id: sourceId
    }
  };
};

// return where the file would be found if the image file exists
export const pathFromImageDescriptor = (imageDescriptor) => {
  const { source, purpose } = imageDescriptor;
  if (purpose.category === 'u') {
    if (purpose.element === 't') {
      return config.paths.thumbs(`${source.id}_thumb.jpg`);
    }
  }
};

export const urlFromImageDescriptor = (imageDescriptor) => {
  const { source, purpose } = imageDescriptor;
  if (purpose.category === 'u') {
    if (purpose.element === 't') {
      return path.join(config.dir_thumbs, `${source.id}_thumb.jpg`);
    }
  }
};
