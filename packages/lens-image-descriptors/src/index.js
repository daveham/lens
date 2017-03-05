import path from 'path';
import config from './config';

/* format of image descriptor is
  {
    input: {
      id - catalog source image
      file - name of source file, only provided if necessary for output purpose
      location - x,y position in source image, defaults to 0, 0
      size - size from within source image, defaults to full width, height
    },
    output: {
      id - used for naming output
      purpose - image used for, thumb, etc
      size - size of output
    }
  }
*/
// used as a key into an image cache
export const makeImageKey = ({ input, output }) => {
  const params = output || input;
  const id = params.id || input.id;
  const { purpose } = params;
  return purpose ? `${id}_${purpose}` : id;
};

export const makeSourceImageDescriptor = (id) => {
  return {
    input: { id }
  };
};

export const makeThumbnailImageDescriptor = (id) => {
  return {
    input: { id },
    output: { purpose: 't' } // thumbnail
  };
};

const thumbnailFileName = (id) => {
  return `${id}_thumb.jpg`;
};

// return where the file would be found if the image file exists
export const pathFromImageDescriptor = ({ input, output }) => {
  if (output && output.purpose === 't') {
    return config.utils_paths.thumbs(thumbnailFileName(input.id));
  }
  // TODO: every other case
};

// return ulr to reference image through web server
export const urlFromImageDescriptor = ({ input, output }) => {
  if (output && output.purpose === 't') {
    return path.join(config.dir_thumbs, thumbnailFileName(input.id));
  }
  // TODO: every other case
};

/* format of stats descriptor is
  {
    analysis: identify, ect,
    imageDescriptor: see definition above
    }
  }
*/

export const makeSourceStatsDescriptor = (imageDescriptor) => {
  return {
    analysis: 'i', // identify
    imageDescriptor
  };
};
// used as a key into a stats cache
// the stats key is a superset of an image key
export const makeStatsKey = ({ analysis, imageDescriptor }) => {
  const imageId = makeImageKey(imageDescriptor);
  if (analysis) {
    return `${analysis}_${imageId}`;
  }
  return imageId;
};
