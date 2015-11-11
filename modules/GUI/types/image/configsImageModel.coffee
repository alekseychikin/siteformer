Model = require "model.coffee"

module.exports = Model "TypeImageModel",
  changePath: (path) -> @state.path = path

  changeSizeWidth: (width) -> @state.width = width
  changeSizeHeight: (height) -> @state.height = height

  changeSource: (source) -> @state.source = source
  updatePath: (value) -> @state.path = value
  updateWidth: (value) -> @state.width = value
  updateHeight: (value) -> @state.height = value
  updateSource: (value) -> @state.source = value
  updateStorage: (value) -> @state.storage = value

  updateS3AccessKey: (value) -> @state.s3AccessKey = value
  updateS3SecretKey: (value) -> @state.s3SecretKey = value
  updateS3Bucket: (value) -> @state.s3Bucket = value
  updateS3Path: (value) -> @state.s3Path = value

  getState: -> @state
