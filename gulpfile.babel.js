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

const packagesPath = 'packages';
const excludedPackages = [
  'lens-data-manager',
  'lens-data-service',
  'lens-vagrant'
];
const libDirs = fs.readdirSync(packagesPath)
  .filter(file => fs.statSync(path.join(packagesPath, file)).isDirectory())
  .filter(dir => !excludedPackages.find(exclusion => exclusion === dir))
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
  return gulp.src(scripts)
    .pipe(handleErrors())
    .pipe(watching ? newy(absDestFile) : gutil.noop())
    .pipe(describeFiles('Compiling'))
    .pipe(renameSrcToLib())
    .pipe(babel({
      presets: ['es2015', 'stage-0'],
      plugins: ['add-module-exports', 'transform-runtime'],
      babelrc: false
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
