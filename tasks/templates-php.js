const gulp = require('gulp')
const rename = require('gulp-rename')
const gutt = require('gulp-gutt')
const phpStringifier = require('gutt-php-stringifier')
const plumber = require('gulp-plumber')
const cached = require('gulp-cached')
const browserSync = require('./browser-sync-inst')

module.exports = () => {
	return gulp
		.src([
			'modules/GUI/src/components/**/*.gutt',
			'modules/GUI/src/templates/**/*.gutt',
			'modules/GUI/src/layouts/**/*.gutt'
		], {read: false, base: 'modules/GUI/src'})
		.pipe(plumber())
		.pipe(gutt({
			stringifier: phpStringifier,
			params: {
				// keepImportCustomTag: true
			}
		}))
		.pipe(rename(file => {
			file.extname = '.gutt.php'
			return file
		}))
		.pipe(gulp.dest('modules/GUI/dist/'))
}
