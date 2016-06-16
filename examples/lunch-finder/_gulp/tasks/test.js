import gulp from 'gulp';
import mocha from 'gulp-mocha';
import babel from 'babel-register';


gulp.task('test', () => {
    return gulp.src(['src/js/**/*.spec.js'])
        .pipe(mocha({
            compilers: {
                js: babel
            }
        }));
});


