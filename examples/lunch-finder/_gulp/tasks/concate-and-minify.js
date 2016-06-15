import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';

import config from '../config';


const $ = gulpLoadPlugins();

// Concate and minify files based on the ref comments in the index.html
gulp.task('concate-and-minify', ['test', 'styles', 'scripts'], () => {
    return gulp.src('src/*.html')
        .pipe($.useref({
            searchPath: ['.tmp', 'src', '.']
        }))
        .pipe($.if('*.js', $.uglify()))
        .pipe($.if('*.css', $.cssnano()))
        .pipe($.if('*.html', $.htmlmin({
            collapseWhitespace: false
        })))
        .pipe(gulp.dest(config.distroPath));
});
