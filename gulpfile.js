"use strict";

var gulp = require('gulp');
var concat = require('gulp-concat');

gulp.task('default', ['js', 'css']);

gulp.task('js', function () {
  gulp.src([
    'node_modules/jquery/dist/jquery.min.js',
    'node_modules/bootstrap/dist/bootstrap.js',
    'node_modules/axios/dist/axios.min.js',
    'node_modules/underscore/underscore-min.js',
    'node_modules/dropzone/dist/min/dropzone.min.js'
    ])
    .pipe(concat('client/assets/thirdParty.js'))
    .pipe(gulp.dest('.'));
});

gulp.task('css', function () {
  gulp.src([
    'node_modules/font-awesome/css/font-awesome.min.css',
    'node_modules/bootstrap/dist/css/bootstrap-theme.min.css',
    'node_modules/bootstrap/dist/css/bootstrap.min.css',
    'node_modules/dropzone/dist/min/basic.min.css',
    'node_modules/dropzone/dist/min/dropzone.min.css'
    ])
    .pipe(concat('client/assets/thirdParty.css'))
    .pipe(gulp.dest('.'));
});

// Rerun the task when a file changes
// gulp.task('watch', function() {
//  gulp.watch(paths.scripts, ['scripts']);
//  gulp.watch(paths.images, ['images']);
// });
