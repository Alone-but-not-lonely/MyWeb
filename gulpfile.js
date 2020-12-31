const gulp = require('gulp')

gulp.task('data', function () {
  return gulp.src(['*.json', '*.xml']).pipe(gulp.dest('DATA'))
})
