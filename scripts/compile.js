import { dest, src } from 'gulp';
import babel from 'gulp-babel';
import env from 'gulp-env';
import newy from 'gulp-newy';
import util from 'gulp-util';

import { destination, scripts, scriptsOptions } from './config';
import {
  describeFiles,
  handleErrors,
  switchSrcNameToLibName,
  transformAbsSrcFilePathToAbsDestFilePath,
} from './common';

export default function compile(changedOnly) {
  const envs = env.set({
    NODE_ENV: 'development',
    DEBUG: 'lens*'
  });
  return src(scripts, scriptsOptions)
    .pipe(envs)
    .pipe(handleErrors())
    .pipe(changedOnly ? newy(transformAbsSrcFilePathToAbsDestFilePath) : util.noop())
    .pipe(describeFiles('Compiling'))
    .pipe(switchSrcNameToLibName())
    .pipe(babel({
      presets: [
        [
          '@babel/env', {
          // debug: true,
          targets: { node: true },
          corejs: { version: 3, proposals: true },
          useBuiltIns: 'entry',
        }]
      ],
      plugins: [
        '@babel/transform-runtime',
        '@babel/plugin-proposal-export-default-from',
        [
          '@babel/plugin-proposal-class-properties', {
          loose: true
        }],
      ],
      babelrc: false,
    }))
    .pipe(dest(destination));
}
