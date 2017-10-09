import gulp from 'gulp'
import rename from 'gulp-rename'
import gutt from 'gulp-gutt'
import phpStringifier from 'gutt-php-stringifier'
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
			stringifier: phpStringifier,
			params: {
				keepImportCustomTag: true
			}
		}))
		.pipe(rename(file => {
			file.extname = '.gutt.php'
			return file
		}))
		.pipe(gulp.dest('modules/GUI/dist/'))
}
