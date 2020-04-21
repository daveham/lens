import { src } from 'gulp';
import newy from 'gulp-newy';
import watch from 'gulp-watch';

import { scripts } from './scripts/config';

import {
  describeFiles,
  handleErrors,
  transformAbsSrcFilePathToAbsDestFilePath,
} from './scripts/common';

import compile from './scripts/compile';

export build from './scripts/build';
export lint from './scripts/lint';

export function dev() {
  watch(scripts, () => {
    return compile(true);
  });
}

export function watchOnly() {
  watch(scripts, () => {
    return src(scripts)
      .pipe(handleErrors())
      .pipe(newy(transformAbsSrcFilePathToAbsDestFilePath))
      .pipe(describeFiles('Watching'));
  });
}
