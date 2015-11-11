Model = require "model.coffee"

module.exports = Model "TypeFileModel",
  updateStorage: (value) -> @state.storage = value
  updatePath: (value) -> @state.path = value
  updateS3AccessKey: (value) -> @state.s3AccessKey = value
  updateS3SecretKey: (value) -> @state.s3SecretKey = value
  updateS3Bucket: (value) -> @state.s3Bucket = value
  updateS3Path: (value) -> @state.s3Path = value

  getState: -> @state
