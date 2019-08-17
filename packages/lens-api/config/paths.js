const path = require('path');
const fs = require('fs');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);
export const dotenv = resolveApp('.env');

export const dataFolder = process.env.LENS_DATA || '/data';
export const database = path.join(dataFolder, 'db');
