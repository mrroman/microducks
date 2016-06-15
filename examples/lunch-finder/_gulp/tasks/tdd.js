import gulp from 'gulp';


gulp.task('tdd', ['test'], function() {
    return gulp.watch('src/js/**/*.js', ['test']);
});


