const path = require('path');
const fs = require('fs');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

const dataDirectory = process.env.LENS_DATA || '/data';

const resolveSourcePath = relativePath => path.resolve(dataDirectory, 'sources', relativePath);
const resolveThumbnailPath = relativePath => path.resolve(dataDirectory, 'thumbs', relativePath);

module.exports = {
  dotenv: resolveApp('.env'),
  data: dataDirectory,
  resolveSourcePath,
  resolveThumbnailPath,
};
