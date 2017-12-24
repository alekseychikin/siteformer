const gulp = require('gulp')
const cached = require('gulp-cached')

module.exports = () => {
	gulp
		.src('modules/GUI/src/components/**/*.{png,svg,jpg}', { base: 'modules/GUI/src' })
		.pipe(cached('images'))
		.pipe(gulp.dest('modules/GUI/dist'))
}
