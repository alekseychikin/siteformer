import gulp from 'gulp'
import postcss from 'gulp-postcss'
import concat from 'gulp-concat'
import cssnext from 'postcss-cssnext'
import pimport from 'postcss-import'
import assets from 'postcss-assets'
import size from 'postcss-size'
import shortFontSize from 'postcss-short-font-size'
import through from 'through2'
import csso from 'gulp-csso'
import yargs from 'yargs'
import rename from 'gulp-rename'
import plumber from 'gulp-plumber'
import sourcemaps from 'gulp-sourcemaps'
import cached from 'gulp-cached'
import browserSync from './browser-sync-inst'

function pass() {
	return through.obj()
}

const {argv} = yargs
const PRODUCTION = argv.production

export default () => {
	const postcssProcess = [
		shortFontSize(),
		pimport(),
		assets({
			basePath: 'modules/GUI/components',
			baseUrl: '/sf-engine/modules/GUI/dist'
		}),
		size(),
		cssnext()
	]

	gulp
		.src([
			'modules/GUI/components/common/reset.css',
			'modules/GUI/components/common/common.css',
			'modules/GUI/components/**/mobile-*.css'
		])
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
			'!modules/GUI/components/common/*.css',
			'!modules/GUI/components/**/mobile-*.css',
			'modules/GUI/components/**/*.css'
		])
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
