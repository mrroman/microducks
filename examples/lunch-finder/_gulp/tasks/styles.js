import gulp from 'gulp';
import browserSync from 'browser-sync';
import gulpLoadPlugins from 'gulp-load-plugins';


const $ = gulpLoadPlugins();
const reload = browserSync.reload;

gulp.task('styles', () => {
    return gulp.src('src/scss/*.scss')
        .pipe($.sass({
            errLogToConsole: true
        }))
        .pipe($.sourcemaps.init())
        .pipe($.autoprefixer({
            browsers: ['last 3 versions']
        }))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest('.tmp/css'))
        .pipe(reload({
            stream: true
        }));
});
