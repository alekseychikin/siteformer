import gulp from 'gulp'
import cached from 'gulp-cached'

export default () => {
	gulp
		.src('modules/GUI/components/**/*.{png,svg,jpg}')
		.pipe(cached('images'))
		.pipe(gulp.dest('modules/GUI/dist'))
}
