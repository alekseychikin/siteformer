import gulp from 'gulp'
import rename from 'gulp-rename'

export default () => {
	gulp
		.src('./components/**/*.{woff,eot,ttf}')
		.pipe(rename(path => {
			path.dirname = ''
			return path
		}))
		.pipe(gulp.dest('./out/dist'))
}
