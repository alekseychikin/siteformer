Model = require "model.coffee"

module.exports = Model "TypeImageModel",
  setFields: (fields) ->
    sources = []
    for field, index in  fields
      if field.type == "image" && index != @state.index && field.alias.length
        sources.push alias: field.alias, label: field.title
    @set {sources}

  updateStorage: (value) -> @set storage: value

  updatePath: (value) -> @set path: value

  updateS3AccessKey: (value) -> @set s3AccessKey: value
  updateS3SecretKey: (value) -> @set s3SecretKey: value
  updateS3Bucket: (value) -> @set s3Bucket: value
  updateS3Path: (value) -> @set s3Path: value

  updateWidth: (value) -> @set width: value
  updateHeight: (value) -> @set height: value
  updateSource: (value) -> @set source: value

  getState: -> @state
