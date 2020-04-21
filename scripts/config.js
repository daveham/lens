import fs from "fs";
import path from "path";

export const packagesPath = path.resolve(__dirname, '../packages');
const includedPackages = [
  'lens-data-jobs',
  'lens-image-descriptors',
  'lens-simulation',
];

const libDirs = fs.readdirSync(packagesPath)
  .filter(dir => includedPackages.includes(dir))
  .filter(file => fs.statSync(path.join(packagesPath, file)).isDirectory())
  .join('|');

export const scripts = `${packagesPath}/@(${libDirs})/src/**/*.js`;

export const scriptsOptions = {
  ignore: [
    `${packagesPath}/@(${libDirs})/src/**/__tests__/**/*.js`,
    `${packagesPath}/@(${libDirs})/src/**/*.test.js`,
  ]
};

export const destination = packagesPath;
