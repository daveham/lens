import chalk from 'chalk';
import { src } from 'gulp';
import newy from 'gulp-newy';
import plumber from 'gulp-plumber';
import util from 'gulp-util';
import watch from 'gulp-watch';
import path from "path";
import through from 'through2';

import { packagesPath, scripts } from './config';

export function describeFiles(label) {
  return through.obj((file, enc, cb) => {
    const filepath = path.relative(packagesPath, file.path);
    util.log(label, '\'' + chalk.cyan(filepath) + '\'');
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

export function announce() {
  watch(scripts, () =>
    src(scripts)
      .pipe(handleErrors())
      .pipe(newy(transformAbsSrcFilePathToAbsDestFilePath))
      .pipe(describeFiles('changed')));
}
