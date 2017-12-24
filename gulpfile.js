const gulp = require('gulp')
const stylesTask = require('./tasks/styles')
const scriptsTask = require('./tasks/scripts')
const templatePhpTask = require('./tasks/templates-php')
const fontTask = require('./tasks/fonts')
const imageTask = require('./tasks/images')
const watch = require('./tasks/watch')
const browserSync = require('./tasks/browser-sync-inst')

gulp.task('watch', ['default'], () => {
	watch('modules/GUI/src/components/**/*.{png,svg,jpg}', ['images'])
	watch('modules/GUI/src/components/**/*.css', ['styles'])
	watch('modules/GUI/src/components/**/*.{woff,eot,ttf}', ['fonts'])
	watch([
		'modules/GUI/src/templates/**/*.gutt',
		'modules/GUI/src/components/**/*.gutt',
		'modules/GUI/src/layouts/**/*.gutt'
	], ['templates-php'])
})

gulp.task('images', imageTask)
gulp.task('styles', stylesTask)
gulp.task('scripts', scriptsTask)
gulp.task('fonts', fontTask)
gulp.task('templates-php', templatePhpTask)
gulp.task('templates', ['templates-php'])

gulp.task('default', ['images', 'styles', 'scripts', 'templates', 'fonts'])
