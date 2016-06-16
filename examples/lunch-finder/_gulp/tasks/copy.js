import gulp from 'gulp';

import config from '../config';


gulp.task('copy', () => {
    return gulp.src([
        'src/*.*',
        '!src/*.html'
    ], {
        dot: true
    }).pipe(gulp.dest(config.distroPath));
});
