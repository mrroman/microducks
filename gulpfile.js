const gulp = require('gulp'),
      babel = require('gulp-babel'),
      concat = require('gulp-concat'),
      mocha = require('gulp-mocha-phantomjs'),
      del = require('del');

gulp.task('clean:dist', (cb) => {
    return del(['dist']);
});

gulp.task('clean:test', () => {
    return del(['test-build']);
});

gulp.task('build:src', ['clean:dist'], () => {
    return gulp.src(['src/modules/*.js', 'src/microducks.js'])
        .pipe(concat('microducks.js'))
        .pipe(babel())
        .pipe(gulp.dest('dist'));
});

gulp.task('build:test', ['clean:test'], () => {
    return gulp.src('test/*.js')
        .pipe(babel())
        .pipe(gulp.dest('test-build'));
});

gulp.task('test', ['build:src', 'build:test'], () => {
    return gulp.src('test/runner.html')
        .pipe(mocha({reporter:'spec'}))
        .on('error', (e) => {
            console.log('[mocha]', e.message);
            gulp.emit('end');
        });
});

gulp.task('dev', ['test'], () => {
    gulp.watch(['src/modules/*.js', 'src/microducks.js'], ['test']);
    gulp.watch('test/*.js', ['test']);
});
