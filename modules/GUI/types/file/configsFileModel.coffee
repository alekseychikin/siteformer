Model = require "model.coffee"

module.exports = Model "TypeFileModel",
  updateStorage: (value) -> @set storage: value
  updatePath: (value) -> @set path: value
  updateS3AccessKey: (value) -> @set s3AccessKey: value
  updateS3SecretKey: (value) -> @set s3SecretKey: value
  updateS3Bucket: (value) -> @set s3Bucket: value
  updateS3Path: (value) -> @set s3Path: value

  getState: -> @state
