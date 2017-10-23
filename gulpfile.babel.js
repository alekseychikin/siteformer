import gulp from 'gulp'
import stylesTask from './tasks/styles'
import scriptsTask from './tasks/scripts'
import templatePhpTask from './tasks/templates-php'
import templateJsTask from './tasks/templates-js'
import fontTask from './tasks/fonts'
import imageTask from './tasks/images'
import watch from './tasks/watch'
import browserSync from './tasks/browser-sync-inst'

gulp.task('watch', ['default'], () => {
	watch('modules/GUI/components/**/*.{png,svg,jpg}', ['images'])
	watch('modules/GUI/components/**/*.css', ['styles'])
	watch('modules/GUI/components/**/*.{woff,eot,ttf}', ['fonts'])
	watch(['modules/GUI/components/**/*.js', 'modules/GUI/libs/*.js'], ['scripts'])
	watch([
		'modules/GUI/templates/**/*.gutt',
		'modules/GUI/components/**/*.gutt',
		'modules/GUI/components/app.js'
	], ['scripts', 'templates-php'])
})

gulp.task('images', imageTask)
gulp.task('styles', stylesTask)
gulp.task('scripts', ['templates-js'], scriptsTask)
gulp.task('fonts', fontTask)
gulp.task('templates-php', templatePhpTask)
gulp.task('templates-js', templateJsTask)
gulp.task('templates', ['templates-php', 'templates-js'])

gulp.task('default', ['images', 'styles', 'scripts', 'templates', 'fonts'])
