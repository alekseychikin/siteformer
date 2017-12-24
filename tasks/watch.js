const gulp = require('gulp')
const chokidar = require('chokidar')

module.exports = (src, tasks) => {
	chokidar.watch(src, {ignoreInitial: true}).on('all', () => gulp.start(tasks))
}
