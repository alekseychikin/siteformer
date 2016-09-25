var gulp = require('gulp');
var path = require('path');
var through = require('through2');
var Buffer = require('buffer').Buffer
var parser = require('html-parser');
var using = require('gulp-using');

module.exports = (function (src, pwd, dest) {
  return function () {
    var results = {};

    gulp
      .src(src)
      .pipe(using({}))
      .pipe(through.obj(function (file, enc, next) {
        results[file.path] = parser.parse(file.contents.toString(), file.path, pwd).strings()
        file.contents = new Buffer(results[file.path].js)
        file.path =
          path.resolve(path.dirname(file.path), path.basename(file.path, path.extname(file.path)) + '.js')
        next(null, file);
      }))
      .pipe(gulp.dest(dest))

    gulp
      .src(src)
      .pipe(through.obj(function (file, enc, next) {
        results[file.path] = parser.parse(file.contents.toString(), file.path, pwd).strings()
        file.contents = new Buffer(results[file.path].php)
        file.path =
          path.resolve(path.dirname(file.path), path.basename(file.path, path.extname(file.path)) + '.php')
        next(null, file);
      }))
      .pipe(gulp.dest(dest))
  }
});
