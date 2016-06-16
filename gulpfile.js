const gulp = require('gulp'),
      babel = require('gulp-babel'),
      concat = require('gulp-concat'),
      mocha = require('gulp-mocha');

gulp.task('build:src', () => {
    return gulp.src('src/*.js')
        .pipe(concat('microducks.js'))
        .pipe(babel())
        .pipe(gulp.dest('dist'));
});

gulp.task('build:test', () => {
    return gulp.src('test/*.js')
        .pipe(babel())
        .pipe(gulp.dest('test-build'));
});

gulp.task('test', ['build:src', 'build:test'], () => {
    return gulp.src('test-build/*.js')
        .pipe(mocha())
        .on('error', (e) => {
            console.log('[mocha]', e.message);
            gulp.emit('end');
        });
});

gulp.task('dev', ['build:src', 'build:test', 'test'], () => {
    gulp.watch('src/*.js', ['build', 'test']);
    gulp.watch('test/*.js', ['test']);
});
