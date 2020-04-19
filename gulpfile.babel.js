const chalk = require('chalk');
const gulp = require('gulp');
const babel = require('gulp-babel');
const eslint = require('gulp-eslint');
const fs = require('fs');
const gutil = require('gulp-util');
const newy = require('gulp-newy');
const path = require('path');
const plumber = require('gulp-plumber');
const through = require('through2');
const watch = require('gulp-watch');
const env = require('gulp-env');

const packagesPath = 'packages';
// const excludedPackages = [
//   'lens-api',
//   'lens-app',
//   'lens-service',
//   'lens-vagrant'
// ];
const includedPackages = [
  'lens-data-jobs',
  'lens-image-descriptors',
  'lens-simulation',
];
const libDirs = fs.readdirSync(packagesPath)
  // .filter(dir => !excludedPackages.find(exclusion => exclusion === dir))
  .filter(dir => includedPackages.find(inclusion => inclusion === dir))
  .filter(file => fs.statSync(path.join(packagesPath, file)).isDirectory())
  .join('|');
const scripts = `${packagesPath}/@(${libDirs})/src/**/*.js`;
const dest = packagesPath;

const srcEx = new RegExp(`(${packagesPath}/[^/]+)/src/`);
const libFragment = '$1/lib/';

function handleErrors() {
  return plumber({
    errorHandler: (err) => gutil.log(err.stack)
  });
}

function renameSrcToLib() {
  return through.obj((file, enc, cb) => {
    file._path = file.path;
    file.path = file.path.replace(srcEx, libFragment);
    cb(null, file);
  });
}

function absDestFile(projectDir, srcFile, absSrcFile) {
  return absSrcFile.replace(srcEx, libFragment);
}

function describeFiles(label) {
  return through.obj((file, enc, cb) => {
    const filepath = path.relative(path.resolve(__dirname, packagesPath), file.path);
    gutil.log(label, '\'' + chalk.cyan(filepath) + '\'...' + ' -' + file.path);
    cb(null, file);
  });
}

function compile(watching) {
  const envs = env.set({
    NODE_ENV: 'development',
    DEBUG: 'lens*'
  });
  return gulp.src(scripts)
    .pipe(envs)
    .pipe(handleErrors())
    .pipe(watching ? newy(absDestFile) : gutil.noop())
    .pipe(describeFiles('Compiling'))
    .pipe(renameSrcToLib())
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
    .pipe(gulp.dest(dest));
}

function build() {
  return compile(false);
}

function dev() {
  watch(scripts, () => {
    return compile(true);
  });
}

function lint() {
  return gulp.src(scripts)
    .pipe(handleErrors())
    .pipe(eslint())
    .pipe(eslint.format())
    .on('data', () => {});
}

function watchOnly() {
  watch(scripts, () => {
    return gulp.src(scripts)
      .pipe(handleErrors())
      .pipe(newy(absDestFile))
      .pipe(describeFiles('Watching'));
  });
}

gulp.task('build', () => build());
gulp.task('dev', () => dev());
gulp.task('lint', () => lint());
gulp.task('watch', () => watchOnly());
