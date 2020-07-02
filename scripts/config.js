import fs from 'fs';
import path from 'path';

export const packagesPath = path.resolve(__dirname, '../packages');

const allPackages = [
  { name: 'lens-api', use: 'cln/lnt' },
  { name: 'lens-app', use: 'cln/lnt' },
  { name: 'lens-data-jobs', use: 'cln/tpl/lnt' },
  { name: 'lens-image-descriptors', use: 'cln/tpl/lnt' },
  { name: 'lens-service', use: 'cln/lnt' },
  { name: 'lens-simulation', use: 'cln/tpl/lnt' },
  { name: 'lens-vagrant', use: '' },
];

const packagesPathContents = fs.readdirSync(packagesPath);

const filterPackagesByUse = use => allPackages.filter(p => p.use.includes(use)).map(p => p.name);

// transpile
const transpilePackages = filterPackagesByUse('tpl');

const transpileFolders = packagesPathContents
  .filter(dir => transpilePackages.includes(dir))
  .filter(file => fs.statSync(path.join(packagesPath, file)).isDirectory());

const transpileFoldersJoined = transpileFolders.join('|');

export const transpileScripts = `${packagesPath}/@(${transpileFoldersJoined})/src/**/*.js`;

export const transpileScriptsOptions = {
  ignore: [
    `${packagesPath}/@(${transpileFoldersJoined})/src/**/__tests__/**/*.js`,
    `${packagesPath}/@(${transpileFoldersJoined})/src/**/*.test.js`,
  ],
};

// lint
const lintPackages = filterPackagesByUse('lnt');

const lintFolders = packagesPathContents
  .filter(dir => lintPackages.includes(dir))
  .filter(file => fs.statSync(path.join(packagesPath, file)).isDirectory());

const lintFoldersJoined = lintFolders.join('|');

export const lintScripts = `${packagesPath}/@(${lintFoldersJoined})/src/**/*.{js,jsx,ts,tsx}`;

// clean
const cleanPackages = filterPackagesByUse('cln');

export const cleanNodeModulesFolders = packagesPathContents
  .filter(dir => cleanPackages.includes(dir))
  .map(dir => path.join(packagesPath, dir, 'node_modules'))
  .filter(fs.existsSync)
  .filter(dir => fs.statSync(dir).isDirectory());

export const cleanLibFolders = packagesPathContents
  .filter(dir => transpileFolders.includes(dir))
  .map(dir => path.join(packagesPath, dir, 'lib'))
  .filter(fs.existsSync)
  .filter(dir => fs.statSync(dir).isDirectory());

export const cleanRootNodeModulesFolder = path.resolve(__dirname, '../node_modules');

export const destination = packagesPath;
