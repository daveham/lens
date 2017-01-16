import path from 'path';

const config = {
  path_base_code: path.resolve(__dirname, '../'),
  path_base_data: path.resolve(__dirname, '../../../data'),
  dir_sources: 'sources',
  dir_thumbs: 'thumbs',
  dir_stats: 'stats',
  dir_tiles: 'tiles'
};

const base_code = () => {
  const args = [config.path_base_code].concat([].slice.call(arguments));
  return path.resolve.apply(path, args);
};

const base_data = () => {
  const args = [config.path_base_data].concat([].slice.call(arguments));
  return path.resolve.apply(path, args);
};

config.paths = {
  base_code,
  base_data,
  sources: base_data.bind(null, config.dir_sources),
  thumbs: base_data.bind(null, config.dir_thumbs),
  stats: base_data.bind(null, config.dir_stats),
  tiles: base_data.bind(null, config.dir_tiles)
};

export default config;
