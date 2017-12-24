const gulp = require('gulp')
const postcss = require('gulp-postcss')
const concat = require('gulp-concat')
const cssnext = require('postcss-cssnext')
const pimport = require('postcss-import')
const assets = require('postcss-assets')
const size = require('postcss-size')
const shortFontSize = require('postcss-short-font-size')
const through = require('through2')
const csso = require('gulp-csso')
const yargs = require('yargs')
const rename = require('gulp-rename')
const plumber = require('gulp-plumber')
const sourcemaps = require('gulp-sourcemaps')
const cached = require('gulp-cached')
const browserSync = require('./browser-sync-inst')

function pass() {
	return through.obj()
}

const {argv} = yargs
const PRODUCTION = argv.production

module.exports = () => {
	const postcssProcess = [
		shortFontSize(),
		pimport(),
		assets({
			basePath: 'modules/GUI/src',
			baseUrl: '/sf-engine/modules/GUI/dist'
		}),
		size(),
		cssnext()
	]

	gulp
		.src([
			'modules/GUI/src/components/common/reset.css',
			'modules/GUI/src/components/common/common.css',
			'modules/GUI/src/components/**/mobile-*.css'
		], { base: 'modules/GUI/src' })
		.pipe(plumber())
		.pipe(PRODUCTION ? pass() : sourcemaps.init())
		.pipe(postcss(postcssProcess))
		.pipe(concat('mobile-bundle.css'))
		.pipe(cached('styles-mobile'))
		.pipe(rename(file => {
			file.dirname = ''
			return file
		}))
		.pipe(PRODUCTION ? pass() : sourcemaps.write('.'))
		.pipe(PRODUCTION ? csso() : pass())
		.pipe(gulp.dest('modules/GUI/dist'))
		.pipe(browserSync.stream())

	return gulp
		.src([
			'!modules/GUI/src/components/common/*.css',
			'!modules/GUI/src/components/**/mobile-*.css',
			'modules/GUI/src/components/**/*.css'
		], { base: 'modules/GUI/src' })
		.pipe(plumber())
		.pipe(PRODUCTION ? pass() : sourcemaps.init())
		.pipe(postcss(postcssProcess))
		.pipe(concat('bundle.css'))
		.pipe(cached('styles-desktop'))
		.pipe(rename(file => {
			file.dirname = ''
			return file
		}))
		.pipe(PRODUCTION ? pass() : sourcemaps.write('.'))
		.pipe(PRODUCTION ? csso() : pass())
		.pipe(gulp.dest('modules/GUI/dist'))
		.pipe(browserSync.stream())
}
