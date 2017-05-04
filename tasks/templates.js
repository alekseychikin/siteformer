var gulp = require('gulp');
var path = require('path');
var through = require('through2');
var Buffer = require('buffer').Buffer
var gutt = require('gutt');
var phpStringifier = require('gutt-php-stringifier');
var browserStringifier = require('gutt-browser-stringifier');
var using = require('gulp-using');
var cache = require('gulp-cached');
var rename = require('gulp-rename');
var browserSync = require('./browser-sync-inst')

function generatePhpTemplates () {
	return through.obj(function (file, enc, next) {
		const template = gutt.parseFile(file.path).stringifyWith(phpStringifier)

		file.contents = new Buffer(template)
		this.push(file)
		next()
	})
}

function generateBrowserTemplates () {
	return through.obj(function (file, enc, next) {
		const template = gutt.parseFile(file.path).stringifyWith(browserStringifier)

		file.contents = new Buffer(template)
		this.push(file)
		next()
	})
}

module.exports = function (src, pwd, dest) {
  return function () {
    var results = {};

    gulp
      .src(src.files, {base: src.base})
      .pipe(using({}))
      .pipe(generatePhpTemplates())
      .pipe(rename(function (path) {
        path.extname = '.tmplt.php'
        return path
      }))
      .pipe(gulp.dest(dest))

    return gulp
      .src(src.files, {base: src.base})
      .pipe(generateBrowserTemplates())
      .pipe(rename(function (path) {
        path.extname = '.tmplt.js'
        return path
      }))
      .pipe(gulp.dest(dest))
      .pipe(browserSync.stream())
  }
};
