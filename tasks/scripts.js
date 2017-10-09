import gulp from 'gulp'
import browserify from 'browserify'
import concat from 'gulp-concat'
import rename from 'gulp-rename'
import through from 'through2'
import plumber from 'gulp-plumber'
import yargs from 'yargs'
import uglify from 'gulp-uglify'
import filterComponents from './filter-components'
import browserifield from './browserifield'
import cached from 'gulp-cached'
import browserSync from './browser-sync-inst'

function pass() {
	return through.obj()
}

const {argv} = yargs
const PRODUCTION = argv.production
const requirePaths = [
	'node_modules',
	'modules/GUI'
]
const external = [
	'libs/component',
	'libs/helpers',
	'libs/import-async',
	'templates/pages/configs',
	'regenerator-runtime'
]

export default () => {
	gulp
		.src([
			'modules/GUI/libs/*.js'
		], {read: false, base: 'modules/GUI'})
		.pipe(browserifield({
			concatToOneBundle: 'libs.js',
			options: {
				transform: 'babelify',
				paths: requirePaths
			}
		}))
		.pipe(PRODUCTION ? uglify() : pass())
		.pipe(cached('scripts-lib'))
		.pipe(gulp.dest('modules/GUI/dist'))
		.pipe(browserSync.stream())

	gulp
		.src('modules/GUI/components/**/*.js', {read: false, base: 'modules/GUI'})
		.pipe(filterComponents('./modules/GUI/dist/components.js'))
		.pipe(browserifield({
			external,
			options: {
				transform: 'babelify',
				paths: requirePaths
			}
		}))
		.pipe(PRODUCTION ? uglify() : pass())
		.pipe(cached('scripts-components'))
		.pipe(gulp.dest('./'))
		.pipe(browserSync.stream())

	return gulp
		.src('modules/GUI/templates/app.js', {read: false, base: 'modules/GUI'})
		.pipe(browserifield({
			external,
			options: {
				transform: 'babelify',
				paths: requirePaths
			}
		}))
		.pipe(PRODUCTION ? uglify() : pass())
		.pipe(cached('scripts-app'))
		.pipe(gulp.dest('modules/GUI/dist'))
		.pipe(browserSync.stream())
}
