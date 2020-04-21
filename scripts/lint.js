import { src } from 'gulp';
import eslint from 'gulp-eslint';
import { handleErrors } from './common';
import { scripts } from './config';

export default function lint() {
  return src(scripts)
    .pipe(handleErrors())
    .pipe(eslint())
    .pipe(eslint.format())
    .on('data', () => {});
}
