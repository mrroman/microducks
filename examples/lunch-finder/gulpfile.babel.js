import gulp from 'gulp';
import browserSync from 'browser-sync';
import gulpLoadPlugins from 'gulp-load-plugins';
import requireDir from 'require-dir';


requireDir('./_gulp/tasks', { recursive: true });

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

gulp.task('serve', ['styles', 'scripts'], () => {
    browserSync({
        notify: false,
        port: 9000,
        open: false,
        server: {
            baseDir: ['.tmp', 'src']
        }
    });

    gulp.watch([
        'src/*.html'
    ]).on('change', reload);

    gulp.watch('src/scss/**/*.scss', ['styles']);
    gulp.watch('src/js/**/*.js', ['scripts']);
});

gulp.task('distro', ['lint', 'test', 'concate-and-minify', 'copy'], () => {
    return gulp.src('dist/**/*').pipe($.size({
        title: 'distro',
        gzip: true
    }));
});

gulp.task('default', ['clean'], () => {
    gulp.start('serve');
});
