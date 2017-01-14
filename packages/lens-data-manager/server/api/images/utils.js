import path from 'path';
import config from 'config';

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

// return where the file would be found if the image file exists
export const pathFromImageDescriptor = (imageDescriptor) => {
  const { source, purpose } = imageDescriptor;
  if (purpose.category === 'u') {
    if (purpose.element === 't') {
      const paths = config.utils_paths;
      const thumbDir = path.join(paths.base(config.dir_data), 'thumbs');
      return path.join(thumbDir, `${source.id}_thumb.jpg`);
    }
  }
};

export const urlFromImageDescriptor = (imageDescriptor) => {
  const { source, purpose } = imageDescriptor;
  if (purpose.category === 'u') {
    if (purpose.element === 't') {
      return path.join('thumbs', `${source.id}_thumb.jpg`);
    }
  }
};
