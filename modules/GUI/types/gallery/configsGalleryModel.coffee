Model = require "model.coffee"

module.exports = Model "TypeGalleryModel",
  updateStorage: (value) -> @set storage: value

  updatePath: (value) -> @set path: value
  updateWidth: (value) -> @set width: value
  updateHeight: (value) -> @set height: value
  updatePreviewWidth: (value) -> @set previewWidth: value
  updatePreviewHeight: (value) -> @set previewHeight: value

  updateS3AccessKey: (value) -> @set s3AccessKey: value
  updateS3SecretKey: (value) -> @set s3SecretKey: value
  updateS3Bucket: (value) -> @set s3Bucket: value
  updateS3Path: (value) -> @set s3Path: value

  getState: -> @state
