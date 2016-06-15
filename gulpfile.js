const gulp = require('gulp'),
      babel = require('gulp-babel'),
      concat = require('gulp-concat');

gulp.task('build', () => {
    gulp.src('src/*.js')
        .pipe(concat('microducks.js'))
        .pipe(babel())
        .pipe(gulp.dest('dist'));
});

gulp.task('dev', () => {
    gulp.watch('src/*.js', ['build']);
});
