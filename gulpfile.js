const gulp = require('gulp');
const scss = require('scss');
const del = require('del');

const path = {
  styles : {
    src: 'src/styles/**/*.scss',
    dest: 'dist/css/'
  },
  scripts : {
    src: 'src/scripts/**/*.js',
    dest: 'dist/js/'
  }
}

function clean() {
  return del(['dist']);
}

exports.clean = clean;