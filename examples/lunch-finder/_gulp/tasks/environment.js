import gulp from 'gulp';

import config from '../config';


gulp.task('environment:prod', (callback) => {
    config.env = {
        value: 'production',
        isProduction: true
    };

    callback();
});
