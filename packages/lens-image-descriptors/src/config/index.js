import path from 'path';

const config = {
  path_base_code: path.resolve(__dirname, '../'),
  path_base_data: process.env.DATA_FOLDER || '/data',
  dir_sources: 'sources',
  dir_thumbs: 'thumbs',
  dir_stats: 'stats',
  dir_tiles: 'tiles'
};

config.utils_paths = (() => {
  const resolve = path.resolve;

  const base_code = (...args) =>
    resolve.apply(resolve, [config.path_base_code, ...args]);

  const base_data = (...args) =>
    resolve.apply(resolve, [config.path_base_data, ...args]);

  return {
    base_code,
    base_data,
    sources: base_data.bind(null, config.dir_sources),
    thumbs: base_data.bind(null, config.dir_thumbs),
    stats: base_data.bind(null, config.dir_stats),
    tiles: base_data.bind(null, config.dir_tiles)
  };
})();

export default config;
