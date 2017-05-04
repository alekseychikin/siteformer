var gulp = require('gulp')
var browserify = require('browserify')
var coffeeify = require('coffeeify')
var rename = require('gulp-rename')
var plumber = require('gulp-plumber')
var gutil = require('gulp-util')
var path = require('path')
var uglify = require('gulp-uglify')
var cache = require('gulp-cached')
var browserSync = require('./tasks/browser-sync-inst')
var yargs = require('yargs')

var watch = require('./tasks/watch')
var templatesTask = require('./tasks/templates')
var imagesTask = require('./tasks/images')
var stylesTask = require('./tasks/styles')
var browserified = require('./tasks/browserified')
var filterComponentsEntires = require('./tasks/filter-components-entires')
var generateCommonBundleFile = require('./tasks/generate-common-bundle')

var COMPONENTS_PATH = 'modules/GUI/components'
var DIST_PATH = 'modules/GUI/dist'
var LIBS_PATH = 'modules/GUI/libs'

var requirePaths = [
  'node_modules',
  'modules/GUI'
]

gulp.task('default', ['styles', 'polyfills', 'templates', 'scripts', 'scripts-lib', 'images'])

gulp.task('watch', ['default'], function () {
  if (!yargs.argv.host) {
    throw new Error(
      'Watch task open with proxy over existing server. Pass host parameter like at example:\n' +
      'gulp watch --host localhost:8080\n'
    )
  }

  browserSync.init({
    proxy: yargs.argv.host
  })

  watch('modules/GUI/**/*.html', 'scripts')
  watch('modules/GUI/sections/**/*.css', 'styles')
  watch('modules/GUI/components/**/*.css', 'styles')
  watch('modules/GUI/libs/**/*.{js,coffee}', 'scripts-lib')
  watch('modules/GUI/components/**/*.{js,coffee}', 'scripts-lib')
  watch('modules/GUI/sections/**/*.{js,coffee}', 'scripts')
  watch('modules/GUI/types/**/*.{js,coffee}', 'scripts')
  watch('modules/GUI/**/*.tmplt', 'scripts')
  watch('modules/GUI/components/**/*.{png,svg,jpg,jpeg}', 'images')
})

gulp.task('templates', templatesTask(
  {
    files: [
      'modules/GUI/components/**/*.tmplt',
      'modules/GUI/sections/**/*.tmplt',
      'modules/GUI/types/**/*.tmplt'
    ],
    base: 'modules/GUI'
  },
  'modules/GUI/dist',
  'modules/GUI/dist'
))

gulp.task('styles', stylesTask([
  COMPONENTS_PATH + '/common/reset.css',
  COMPONENTS_PATH + '/common/default.css',
  COMPONENTS_PATH + '/**/*.css'
], COMPONENTS_PATH, DIST_PATH, 'main.css'))

process.on('uncaughtException', function (er) {
  console.log(er.toString())
  this.emit('end')
})

var polyfills = [
  'node_modules/promise-polyfill/promise.js',
  'modules/GUI/libs/polyfills.js',
  'modules/GUI/libs/object-assign.js',
  'modules/GUI/libs/array-from.js'
]
var commonBundle = [
  'modules/GUI/libs/view.coffee',
  'modules/GUI/libs/model.coffee',
  'modules/GUI/libs/render.js',
  'modules/GUI/libs/ajax.coffee',
  'modules/GUI/libs/popup.js',
  'modules/GUI/libs/components.coffee',
  'modules/GUI/libs/helpers.coffee'
]
var exposeCommonBundle = {
  'modules/GUI/libs/view.coffee': 'view.coffee',
  'modules/GUI/libs/model.coffee': 'model.coffee',
  'modules/GUI/libs/render.js': 'render',
  'modules/GUI/libs/ajax.coffee': 'ajax.coffee',
  'modules/GUI/libs/popup.js': 'popup',
  'modules/GUI/libs/components.coffee': 'components.coffee',
  'modules/GUI/libs/helpers.coffee': 'helpers.coffee'
}

gulp.task('polyfills', function () {
  return gulp.src(polyfills)
  .pipe(uglify())
  .pipe(gulp.dest('modules/GUI/dist/polyfills'))
})

gulp.task('scripts-lib', ['scripts-components'], function () {
  gulp
    .src(commonBundle, {base: 'modules/GUI/libs'})
    .pipe(generateCommonBundleFile('common-bundle.js'))
    .pipe(gulp.dest('modules/GUI/dist'))

  gulp
    .src('modules/GUI/dist/common-bundle.js')
    .pipe(browserified({
      require: exposeCommonBundle,
      options: {
        transform: [
          'coffeeify'
        ],
        debug: false,
        paths: requirePaths
      }
    }))
    .on('error', function (err) {
      console.log(err.toString())
      gutil.beep()
      this.emit('end')
    })
    .pipe(gulp.dest('modules/GUI/dist'))
    .pipe(browserSync.stream())
})

gulp.task('scripts-components', function () {
  return gulp
    .src(['modules/GUI/components/**/*'])
    .pipe(filterComponentsEntires({exts: ['.js', '.coffee']}))
    .pipe(browserified({
      options: {
        transform: [
          'coffeeify'
        ],
        debug: false,
        paths: requirePaths
      },
      external: exposeCommonBundle
    }))
    .pipe(rename(function (file) {
      file.extname = '.js'
      return file
    }))
    .pipe(cache('js-components'))
    .pipe(gulp.dest('modules/GUI/dist/components'))
    .pipe(browserSync.stream())
})

gulp.task('scripts', ['templates', 'scripts-components'], function () {
  return gulp
    .src([
      '!modules/GUI/sections/**/*Model.coffee',
      '!modules/GUI/sections/**/*View.coffee',
      'modules/GUI/sections/**/*.coffee'
    ])
    .pipe(browserified({
      options: {
        transform: [
          'coffeeify'
        ],
        debug: true,
        paths: requirePaths
      },
      external: exposeCommonBundle
    }))
    .on('error', function (err) {
      console.log(err.toString())
      gutil.beep()
      this.emit('end')
    })
    .pipe(rename(function (file) {
      file.extname = '.js'
      return file
    }))
    .pipe(cache('scripts'))
    .pipe(gulp.dest('modules/GUI/dist'))
    .pipe(browserSync.stream())
})

gulp.task('images', imagesTask([COMPONENTS_PATH + '/**/*.{png,svg,jpg,jpeg}'], COMPONENTS_PATH, DIST_PATH))
