var gulp = require('gulp')

module.exports = function (src, pwd, dest) {
  return function () {
    gulp
      .src(src, {base: pwd})
      .pipe(gulp.dest(dest))
  }
}
