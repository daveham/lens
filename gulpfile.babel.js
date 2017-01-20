const chalk = require('chalk');
const gulp = require('gulp');
const gutil = require('gulp-util');
const newer = require('gulp-newer');
const path = require('path');
//const plumber = require('gulp-plumber');
const through = require('through2');
const watch = require('gulp-watch');

const scripts = './packages/*/src/**/*.js';
const dest = 'packages';

const srcEx = new RegExp('(packages/[^/]+)/src/');
const libFragment = '$1/lib/';

function renameSrcToLib() {
  return through.obj((file, enc, cb) => {
    file._path = file.path;
    file.path = file.path.replace(srcEx, libFragment);
    cb(null, file);
  });
}

function compile(watch) {
  return gulp.src(scripts)
    .pipe(renameSrcToLib())
    .pipe(watch ? newer(dest) : gutil.noop())
    .pipe(through.obj((file, enc, cb) => {
      const filepath = path.relative(path.resolve(__dirname, 'packages'), file._path);
      gutil.log('Compiling', '\'' + chalk.cyan(filepath) + '\'...');
      cb(null, file);
    }))
    .pipe(gulp.dest(dest));
}

gulp.task('build', () => compile(false));

gulp.task('dev', () => {
  watch(scripts, () => {
    compile(true);
  });
});
