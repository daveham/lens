import { src } from 'gulp';
import eslint from 'gulp-eslint';
import { describeFiles, handleErrors } from './common';
import { lintScripts } from './config';

export default function lint() {
  return src(lintScripts)
    .pipe(handleErrors())
    .pipe(describeFiles('linting'))
    .pipe(eslint())
    .pipe(eslint.format())
    .on('data', () => {});
}
