const gulp = require('gulp'),
      webpack = require('gulp-webpack'),
      connect = require('gulp-connect');

gulp.task('build:js', () => {
    gulp.src('src/*.js')
        .pipe(webpack(require('./webpack.config.js')))
        .pipe(gulp.dest('public/js'))
        .pipe(connect.reload());
});

gulp.task('watch', () => {
    gulp.watch(['src/*.js', '../../dist/microducks.js'], ['build:js']);
});

gulp.task('serve', () => {
    connect.server({
        root: 'public',
        livereload: true
    });
});

gulp.task('dev', ['build:js', 'serve', 'watch']);
