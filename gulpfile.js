const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
  
// Compile all Section together {{{
gulp.task('all', function() {
  return gulp.src('./assets/css/style.scss')
    .pipe(autoprefixer())
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(gulp.dest('./dist/'));
});
//}}}
//
gulp.task('default', function() {
  gulp.watch(['./assets/css/**/*.scss'], gulp.series('all'));
});
