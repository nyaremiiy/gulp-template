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
import size from 'gulp-size';
import newer from 'gulp-newer';
import browserSync from 'browser-sync';
const browsersync = browserSync.create();
import gulpPug from 'gulp-pug';

const path = {
  pug: {
    src: 'src/*.pug',
    dest: 'dist/',
  },
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
    src: 'src/assets/img/**/*.*',
    dest: 'dist/assets/img/',
  },
};

function clean() {
  return del(['dist/*', '!dist/assets', '!dist/assets/img']);
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
        basename: 'main',
        suffix: '.min',
      })
    )
    .pipe(sourcemaps.write('.'))
    .pipe(size())
    .pipe(gulp.dest(path.styles.dest))
    .pipe(browsersync.stream());
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
    .pipe(concat('main.min.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(size())
    .pipe(gulp.dest(path.scripts.dest))
    .pipe(browsersync.stream());
}

function img() {
  return gulp
    .src(path.img.src)
    .pipe(newer(path.img.dest))
    .pipe(
      imagemin({
        progressive: true,
      })
    )
    .pipe(size())
    .pipe(gulp.dest(path.img.dest));
}

function pug() {
  return gulp
    .src(path.pug.src)
    .pipe(gulpPug())
    .pipe(size())
    .pipe(gulp.dest(path.pug.dest))
    .pipe(browsersync.stream());
}
function html() {
  return gulp
    .src(path.html.src)
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(size())
    .pipe(gulp.dest(path.html.dest))
    .pipe(browsersync.stream());
}

function watch() {
  browsersync.init({
    server: {
      baseDir: './dist/',
    },
  });
  gulp.watch(path.html.dest).on('change', browsersync.reload);
  gulp.watch(path.html.src, html);
  gulp.watch(path.styles.src, styles);
  gulp.watch(path.scripts.src, scripts);
  gulp.watch(path.img.src, img);
}

const build = gulp.series(
  clean,
  html,
  gulp.parallel(styles, scripts, img),
  watch
);

export default build;
