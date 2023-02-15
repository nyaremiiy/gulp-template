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
import sourcemaps from 'gulp-sourcemaps';
import autoprefixer from 'gulp-autoprefixer';
import imagemin from 'gulp-imagemin';
import htmlmin from 'gulp-htmlmin';

const path = {
  html: {
    src: 'src/*.html',
    dest: 'dist/',
  },
  styles: {
    src: 'src/styles/**/*.scss',
    dest: 'dist/css/',
  },
  scripts: {
    src: 'src/scripts/**/*.js',
    dest: 'dist/js/',
  },
  img: {
    src: 'src/assets/img/*',
    dest: 'dist/assets/img/',
  },
};

function clean() {
  return del(['dist']);
}

function styles() {
  return gulp
    .src(path.styles.src)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(
      autoprefixer({
        cascade: false,
      })
    )
    .pipe(
      cleanCSS({
        level: 2,
      })
    )
    .pipe(
      rename({
        basename: 'min',
        suffix: '.min',
      })
    )
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(path.styles.dest));
}

function scripts() {
  return gulp
    .src(path.scripts.src)
    .pipe(sourcemaps.init())
    .pipe(
      babel({
        presets: ['@babel/env'],
      })
    )
    .pipe(uglify())
    .pipe(concat('man.min.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(path.scripts.dest));
}

function img() {
  return gulp
    .src(path.img.src)
    .pipe(
      imagemin({
        progressive: true,
      })
    )
    .pipe(gulp.dest(path.img.dest));
}

function html() {
  return gulp
    .src(path.html.src)
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest(path.html.dest));
}

function watch() {
  gulp.watch(path.styles.src, styles);
  gulp.watch(path.scripts.src, scripts);
}

const build = gulp.series(
  clean,
  html,
  gulp.parallel(styles, scripts, img),
  watch
);

export default build;
