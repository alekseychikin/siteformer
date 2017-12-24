const gulp = require('gulp')
const rename = require('gulp-rename')

module.exports = () => {
	gulp
		.src('modules/GUI/src/fonts/*.{woff,eot,ttf}')
		.pipe(rename(path => {
			path.dirname = ''
			return path
		}))
		.pipe(gulp.dest('modules/GUI/dist'))
}
