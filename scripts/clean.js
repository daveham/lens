import rimraf from 'rimraf';

import {
  cleanNodeModulesFolders,
  cleanLibFolders,
  cleanRootNodeModulesFolder,
} from './config';

function rimrafPromise(path) {
  return new Promise((resolve, reject) => {
    console.log('cleaning path', path);
    rimraf(path, err => {
      if (err) {
        console.log('cleaning path error', err);
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

export default function clean() {
  const packageFolders = [
    ...cleanNodeModulesFolders,
    ...cleanLibFolders,
  ];
  return Promise.all(packageFolders.map(rimrafPromise))
    .then(() => rimrafPromise(cleanRootNodeModulesFolder));
}
