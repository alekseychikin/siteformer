import gulp from 'gulp'
import rename from 'gulp-rename'
import gutt from 'gulp-gutt'
import browserStringifier from 'gutt-browser-stringifier'
import plumber from 'gulp-plumber'
import cached from 'gulp-cached'
import browserSync from './browser-sync-inst'

export default () => {
	return gulp
		.src([
			'modules/GUI/components/**/*.gutt',
			'modules/GUI/templates/**/*.gutt'
		], {read: false, base: 'modules/GUI'})
		.pipe(plumber())
		.pipe(gutt({
			stringifier: browserStringifier,
			params: {
				keepImportCustomTag: true
			}
		}))
		.pipe(rename(file => {
			file.extname = '.gutt.js'
			return file
		}))
		.pipe(gulp.dest('modules/GUI/dist/'))
}
