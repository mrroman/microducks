import gulp from 'gulp';
import browserSync from 'browser-sync';
import gulpLoadPlugins from 'gulp-load-plugins';

import config from '../config';


const $ = gulpLoadPlugins();
const reload = browserSync.reload;

gulp.task('scripts', ['lint'], function () {
    return gulp.src(config.webpack.entry)
        .pipe($.webpack(config.webpack))
        .pipe(config.env.isProduction ? $.uglify() : $.util.noop())
        .pipe(gulp.dest(config.webpack.dest))
        .pipe(reload({
            stream: true
        }));
});
