var through = require('through2');
var browserify = require('browserify');
var path = require('path')

module.exports = function browserified (params) {
  params || (params = {})
  params.options || (params.options = {})
  params.require || (params.require = {})
  params.external || (params.external = {})

  return through.obj(function (file, enc, next) {
    var i
    var brwsrf = browserify(file.path, params.options)

    for (i in params.require) {
      if (params.require.hasOwnProperty.call(params.require, i)) {
        brwsrf.require(path.resolve(i), {expose: params.require[i]})
      }
    }

    for (i in params.external) {
      if (params.external.hasOwnProperty.call(params.external, i)) {
        brwsrf.external(params.external[i])
      }
    }

    brwsrf.bundle(function (err, res) {
      if (err) {
        file.contents = null
        next(err, file)
      } else {
        file.contents = res
        next(err, file)
      }
    })
  })
}
