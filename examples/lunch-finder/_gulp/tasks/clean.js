import gulp from 'gulp';
import del from 'del';

import config from '../config';


gulp.task('clean', del.bind(null, ['.tmp', config.distroPath]));
