import path from 'path';

const config = {
  pathBaseCode: path.resolve(__dirname, '../'),
  pathBaseData: process.env.DATA_FOLDER || '/data',
  dirSources: 'sources',
  dirThumbs: 'thumbs',
  dirStats: 'stats',
  dirTiles: 'tiles',
};

config.utilsPaths = (() => {
  const resolve = path.resolve;

  const baseCode = (...args) => resolve.apply(resolve, [config.pathBaseCode, ...args]);

  const baseData = (...args) => resolve.apply(resolve, [config.pathBaseData, ...args]);

  return {
    baseCode: baseCode,
    baseData: baseData,
    sources: baseData.bind(null, config.dirSources),
    thumbs: baseData.bind(null, config.dirThumbs),
    stats: baseData.bind(null, config.dirStats),
    tiles: baseData.bind(null, config.dirTiles),
  };
})();

export default config;
