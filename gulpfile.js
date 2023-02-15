import gulp from 'gulp';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
const sass = gulpSass(dartSass);
import { deleteAsync as del } from 'del';
import cleanCSS from 'gulp-clean-css';
import rename from 'gulp-rename';
import babel from 'gulp-babel';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';

const path = {
  styles: {
    src: 'src/styles/**/*.scss',
    dest: 'dist/css/',
  },
  scripts: {
    src: 'src/scripts/**/*.js',
    dest: 'dist/js/',
  },
};

function clean() {
  return del(['dist']);
}

function styles() {
  return gulp
    .src(path.styles.src)
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCSS())
    .pipe(
      rename({
        basename: 'min',
        suffix: '.min',
      })
    )
    .pipe(gulp.dest(path.styles.dest));
}

function scripts() {
  return gulp
    .src(path.scripts.src, {
      sourcemaps: true,
    })
    .pipe(babel())
    .pipe(uglify())
    .pipe(concat('man.min.js'))
    .pipe(gulp.dest(path.scripts.dest));
}

function watch() {
  gulp.watch(path.styles.src, styles);
  gulp.watch(path.scripts.src, scripts);
}

const build = gulp.series(clean, gulp.parallel(styles, scripts), watch);

export default build;
