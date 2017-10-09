import gulp from 'gulp'
import chokidar from 'chokidar'

export default (src, tasks) => {
	chokidar.watch(src, {ignoreInitial: true}).on('all', () => gulp.start(tasks))
}
