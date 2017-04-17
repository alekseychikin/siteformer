var gulp = require('gulp')
var postcss = require('gulp-postcss')
var concat = require('gulp-concat')
var cssnext = require('postcss-cssnext')
var pimport = require('postcss-import')
var assets = require('postcss-assets')
var size = require('postcss-size')
var through = require('through2')
var csso = require('gulp-csso')
var yargs = require('yargs')
var plumber = require('gulp-plumber')
var sourcemaps = require('gulp-sourcemaps')
var cached = require('gulp-cached')
var browserSync = require('browser-sync').create()

function pass() {
  return through.obj()
}

var argv = yargs.argv
var PRODUCTION = argv.production

module.exports = function (src, pwd, dest, bundleName) {
  return function () {
    gulp
      .src(src, {base: pwd})
      .pipe(plumber())
      .pipe(PRODUCTION ? pass() : sourcemaps.init())
      .pipe(postcss([
        pimport(),
        assets({
          basePath: pwd,
          baseUrl: './'
        }),
        cssnext(),
        size()
      ]))
      .pipe(concat(bundleName))
      .pipe(cached('styles'))
      .pipe(PRODUCTION ? pass() : sourcemaps.write('.'))
      .pipe(PRODUCTION ? csso() : pass())
      .pipe(gulp.dest(dest))
      .pipe(browserSync.stream())
  }
}
