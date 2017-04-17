var gulp = require('gulp');
var chokidar = require('chokidar');

module.exports = function watch(src, tasks) {
  chokidar.watch(src, {ignoreInitial: true}).on('all', function () {
    gulp.start(tasks);
  });
}
