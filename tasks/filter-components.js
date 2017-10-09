import through from 'through2'
import fs from 'fs'
import gutil from 'gulp-util'
import path from 'path'

const File = gutil.File
const cwd = process.cwd()

export default function (tmpBundle) {
	const filenames = []

	function prepareComponentName (basename) {
		return basename.split('-')
		.map(part => part.substr(0, 1).toUpperCase() + part.substr(1))
		.join('')
	}

	function handleStreams (file, enc, next) {
		const dirname = path.dirname(file.path).split(path.sep)
		const basename = path.basename(file.path, '.js')
		const componentName = dirname.pop()

		if (componentName === basename) {
			filenames.push({
				path: path.relative(path.dirname(path.resolve(cwd, tmpBundle)), file.path),
				componentName: prepareComponentName(basename)
			})
		}

		next()
	}

	function endStream (done) {
		const componentsTemplate = fs.readFileSync('./tasks/components.js.template', 'utf8')
		let importComponents = filenames
		.map(component => `import ${component.componentName} from './${component.path}'`)
		.join('\n')

		importComponents +=
			`\n\nconst components = [\n  ${filenames.map(component => component.componentName).join(',\n  ')}\n]\n`

		fs.writeFileSync(path.resolve(cwd, tmpBundle), importComponents + componentsTemplate, 'utf8')

		this.push(new File({
			contents: '',
			path: tmpBundle,
			base: './'
		}))

		done()
	}

	return through.obj(handleStreams, endStream)
}
