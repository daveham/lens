import chalk from 'chalk';
import plumber from 'gulp-plumber';
import util from 'gulp-util';
import path from "path";
import through from 'through2';

import { packagesPath } from './config';

export function describeFiles(label) {
  return through.obj((file, enc, cb) => {
    const filepath = path.relative(packagesPath, file.path);
    util.log(label, '\'' + chalk.cyan(filepath) + '\'...' + ' -' + file.path);
    cb(null, file);
  });
}

const srcRegExp = new RegExp(`(${packagesPath}/[^/]+)/src/`);
const libFragment = '$1/lib/';
const transformSourcePathToLibPath = srcPath => srcPath.replace(srcRegExp, libFragment);

export function switchSrcNameToLibName() {
  return through.obj((file, enc, cb) => {
    file._path = file.path;
    file.path = transformSourcePathToLibPath(file.path);
    cb(null, file);
  });
}

export function transformAbsSrcFilePathToAbsDestFilePath(projectDir, srcFile, absSrcFile) {
  return transformSourcePathToLibPath(absSrcFile);
}

export function handleErrors() {
  return plumber({
    errorHandler: (err) => util.log(err.stack)
  });
}


