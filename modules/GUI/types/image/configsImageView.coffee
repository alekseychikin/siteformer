View = require "view.coffee"
configsImageModel = require "image/configsImageModel.coffee"

module.exports = View "TypeImageView",
  model: configsImageModel

  initial: ->
    @configsImagePath = @contain.find "@configs-image-path"
    @configsImageSource = @contain.find "@configs-image-source"
    @configsImageWidth = @contain.find "@configs-image-width"
    @configsImageHeight = @contain.find "@configs-image-height"
    @configsImageIndex = @contain.find "@configs-image-index"
    @configsImageStorage = @contain.find "@configs-image-storage"
    @configsImageS3AccessKey = @contain.find "@configs-image-s3-access-key"
    @configsImageS3SecretKey = @contain.find "@configs-image-s3-secret-key"
    @configsImageS3Bucket = @contain.find "@configs-image-s3-bucket"
    @configsImageS3Path = @contain.find "@configs-image-s3-path"

  events:
    "submit: @configs-form": "submitConfigsForm"
    "change: @configs-image-path": (e) -> configsImageModel.updatePath e.target.value
    "change: @configs-image-width": (e) -> configsImageModel.updateWidth e.target.value
    "change: @configs-image-height": (e) -> configsImageModel.updateHeight e.target.value
    "change: @configs-image-source": (e) -> configsImageModel.updateSource e.target.value
    "popup-close: contain": (e) -> @unbind()
    "change: @configs-image-storage": (e) -> configsImageModel.updateStorage ($ e.target).data "value"
    "change: @configs-image-s3-access-key": (e) -> configsImageModel.updateS3AccessKey e.target.value
    "change: @configs-image-s3-secret-key": (e) -> configsImageModel.updateS3SecretKey e.target.value
    "change: @configs-image-s3-bucket": (e) -> configsImageModel.updateS3Bucket e.target.value
    "change: @configs-image-s3-path": (e) -> configsImageModel.updateS3Path e.target.value

  initialRender: (state) ->
    (@configsImageStorage.filter "[data-value='#{state.storage}']").trigger "click"
    (@contain.find "@configs-image-modal-storage-frame").hide()
    (@contain.find "@configs-image-modal-storage-#{state.storage}").show()
    @configsImagePath.val state.path
    @configsImageWidth.val state.width
    @configsImageHeight.val state.height
    @configsImageSource.val state.source
    @configsImageS3AccessKey.val state.s3AccessKey
    @configsImageS3SecretKey.val ""
    @configsImageS3Bucket.val state.s3Bucket
    @configsImageS3Path.val state.s3Path

  submitConfigsForm: (e) ->
    @trigger "save-configs-modal", configsImageModel.getState()
    @unbind()
    return false
