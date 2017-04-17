var Transform = require('stream').Transform
var gutil = require('gulp-util')
var Buffer = require('buffer').Buffer
var path = require('path')

module.exports = function filterComponentsEntires(opts) {
  opts.exts || (opts.exts = ['.js'])
  var stream = new Transform({objectMode: true})

  stream._transform = function (file, encoding, next) {
    var ext
    var filename
    var dirname
    if (file.isNull()) {
      // stream.push(file);
      next()
      return
    }

    if (file.isStream()) {
      return next(new gutil.PluginError('filter', 'Streaming not supported'))
    } else {
      ext = path.extname(file.history)

      if (~opts.exts.indexOf(ext)) {
        filename = path.basename(file.history, ext)
        dirname = path.dirname(file.history).split(path.sep).pop()

        if (filename === dirname) {
          file.contents = new Buffer(file.contents)
          stream.push(file)
        }
      }

      next()
    }
  }

  return stream
}
