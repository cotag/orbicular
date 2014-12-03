'use strict';

var gulp = require('gulp');
var compass = require('gulp-compass');

gulp.task('styles', function () {
  gulp.src('./demo/*.scss')
  .pipe(compass({
    css: 'demo',
    sass: 'demo'
  }))
  .pipe(gulp.dest('demo'));
});

gulp.task('build', ['styles']);
