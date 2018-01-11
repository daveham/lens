import path from 'path';
import config from './config';

/* format of image descriptor is
  {
    input: {
      id - catalog source image
      file - name of source file, only provided if necessary for output purpose
      group - used to group tiles (by resolution, row, etc)
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

export const PURPOSE = {
  THUMBNAIL: 't',
  TILE: 'i'
};

// used as a key into an image cache
export const makeImageKey = ({ input, output }) => {
  const params = output || input;
  const id = params.id || input.id;
  const { purpose } = params;
  if (purpose === PURPOSE.TILE) {
    const { group, location } = input;
    return `${id}_${purpose}_${group}_${location.y}_${location.x}`;
  }
  return purpose ? `${id}_${purpose}` : id;
};

const getPurpose = ({ input, output }) => {
  const params = output || input;
  return params.purpose;
};

export const isTileImageDescriptor = (inputDescriptor) => {
  return getPurpose(inputDescriptor) === PURPOSE.TILE;
};

export const isThumbnailImageDescriptor = (inputDescriptor) => {
  return getPurpose(inputDescriptor) === PURPOSE.THUMBNAIL;
};

export const isSourceImageDescriptor = (inputDescriptor) => {
  return !getPurpose(inputDescriptor);
};

export const makeTileImageKeyFromPrototype = (prototypeKey, x, y) => {
  const del1 = prototypeKey.lastIndexOf('_');
  const del2 = prototypeKey.lastIndexOf('_', del1 - 1);
  return `${prototypeKey.substring(0, del2)}_${y}_${x}`;
};

export const makeSourceImageDescriptor = (id) => {
  return {
    input: { id }
  };
};

export const makeThumbnailImageDescriptor = (id) => {
  return {
    input: { id },
    output: { purpose: PURPOSE.THUMBNAIL }
  };
};

export const makeTileImageDescriptor = (id, group, x, y, width, height) => {
  return {
    input: {
      id,
      group,
      location: { x, y },
      size: { width, height }
    },
    output: { purpose: PURPOSE.TILE}
  };
};

const thumbnailFileName = (id) => {
  return `${id}_thumb.jpg`;
};

const tileFileName = (group, y, x) => {
  return `${group}_${y}_${x}.png`;
};

// return where the file would be found if the image file exists
export const pathFromImageDescriptor = ({ input, output }) => {
  if (output) {
    if (output.purpose === PURPOSE.THUMBNAIL)
      return config.utils_paths.thumbs(thumbnailFileName(input.id));

    if (output.purpose === PURPOSE.TILE)
      return config.utils_paths.tiles(input.id,
        input.group.toString(),
        input.location.y.toString(),
        tileFileName(input.group, input.location.y, input.location.x));
  }
  // TODO: every other case
};

// return ulr to reference image through web server
export const urlFromImageDescriptor = ({ input, output }) => {
  if (output) {
    if (output.purpose === PURPOSE.THUMBNAIL)
      return path.join('/', config.dir_thumbs, thumbnailFileName(input.id));

    if (output.purpose === PURPOSE.TILE)
      return path.join('/',
        config.dir_tiles,
        input.id,
        input.group.toString(),
        input.location.y.toString(),
        tileFileName(input.group, input.location.y, input.location.x));
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

export const ANALYSIS = {
  IDENTIFY: 'i'
};

export const isTileStatsDescriptor = ({ imageDescriptor }) => {
  return isTileImageDescriptor(imageDescriptor);
};

export const isThumbnailStatsDescriptor = ({ imageDescriptor }) => {
  return isThumbnailImageDescriptor(imageDescriptor);
};

export const isSourceStatsDescriptor = ({ imageDescriptor }) => {
  return isSourceImageDescriptor(imageDescriptor);
};

export const makeSourceStatsDescriptor = (imageDescriptor) => {
  return {
    analysis: ANALYSIS.IDENTIFY,
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
