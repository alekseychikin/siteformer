Model = require "model.coffee"

module.exports = Model "TypeImageModel",
  updateStorage: (value) -> @state.storage = value

  updatePath: (path) -> @state.path = path
  updatePath: (value) -> @state.path = value
  updateWidth: (value) -> @state.width = value
  updateHeight: (value) -> @state.height = value
  updateSource: (value) -> @state.source = value

  updateS3AccessKey: (value) -> @state.s3AccessKey = value
  updateS3SecretKey: (value) -> @state.s3SecretKey = value
  updateS3Bucket: (value) -> @state.s3Bucket = value
  updateS3Path: (value) -> @state.s3Path = value

  getState: -> @state