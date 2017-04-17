var through = require('through2')
var path = require('path')
var gutil = require('gulp-util')
var File = gutil.File

module.exports = function (fileName) {
  var files = []
  var cwd = ''
  var base = ''

  if (!fileName) {
    throw new Error('gulp-concat: Missing fileName option')
  }

  function bufferContents(file, enc, next) {
    var expose = path.relative(path.resolve(file.cwd, file.base), file.path)

    base = file.base
    cwd = file.cwd

    files.push(expose)

    next()
  }

  function endStream(done) {
    var resultFile = new File({
      contents: new Buffer(files.map(function (file) {
        var ext = path.extname(file)
        var basename = path.basename(file, ext === '.js' ? ext : '')

        return 'require(\'' + path.relative(cwd, path.resolve(path.dirname(file), basename))  + '\');'
      }).join('\n')),
      path: path.resolve(cwd, base, fileName),
      base: base
    })

    this.push(resultFile)

    done()
  }

  return through.obj(bufferContents, endStream)
}
