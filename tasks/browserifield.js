import through from 'through2'
import browserify from 'browserify'
import gutil from 'gulp-util'
import path from 'path'

const File = gutil.File

export default function browserifield (params = {options: {paths: []}}) {
	let commonBundle
	let commonBase

	const bundleOptions = {
		paths: params.options.paths
	}

	function bufferContentsSingleBundle (file, enc, next) {
		let i

		if (!commonBundle) {
			const expose =
				path.relative(path.resolve(file.base), path.resolve(path.dirname(file.path), path.basename(file.path, '.js')))

			commonBundle = browserify(file.path, bundleOptions)
			.require(file.path, {expose: expose})

			commonBase = file.base

			next()
		} else {
			const expose =
				path.relative(path.resolve(file.base), path.resolve(path.dirname(file.path), path.basename(file.path, '.js')))

			commonBundle = commonBundle
			.require(file.path, {expose: expose})

			next()
		}
	}

	function endStream (done) {
		if (params.options.transform) {
			commonBundle
			.transform(params.options.transform)
		}

		commonBundle
		.bundle((err, res) => {
			const bundlePath = path.resolve(commonBase, params.concatToOneBundle)

			if (err) {
				this.push(new File({
					contents: null,
					path: bundlePath,
					base: path.resolve(commonBase)
				}))

				done(gutil.PluginError('browserifield', err.Error))
			} else {
				this.push(new File({
					contents: res,
					path: bundlePath,
					base: path.resolve(commonBase)
				}))

				done()
			}
		})
	}

	function bufferContentsMultipleBundle (file, enc, next) {
		const expose =
			path.relative(path.resolve(file.base), path.resolve(path.dirname(file.path), path.basename(file.path, '.js')))
		const bundle = browserify(file.path, bundleOptions)

		if (params.external) {
			params.external.forEach(modulePath => bundle.external(modulePath))
		}

		bundle
		.require(file.path, {expose: expose})

		if (params.options.transform) {
			bundle
			.transform('babelify')
		}

		bundle
		.bundle(function (err, res) {
			if (err) {
				file.contents = null
				next(err, file)
			} else {
				file.contents = res
				next(err, file)
			}
		})
	}

	return params.concatToOneBundle ?
		through.obj(bufferContentsSingleBundle, endStream) :
		through.obj(bufferContentsMultipleBundle)
}
