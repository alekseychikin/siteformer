View = require "view.coffee"
configsGalleryModel = require "gallery/configsGalleryModel.coffee"

module.exports = View "TypeGalleryView",
  model: configsGalleryModel

  initial: ->
    @configsGalleryPath = @contain.find "@configs-gallery-path"
    @configsGalleryWidth = @contain.find "@configs-gallery-width"
    @configsGalleryHeight = @contain.find "@configs-gallery-height"
    @configsGalleryPreviewWidth = @contain.find "@configs-gallery-preview-width"
    @configsGalleryPreviewHeight = @contain.find "@configs-gallery-preview-height"
    @configsGalleryIndex = @contain.find "@configs-gallery-index"
    @configsGalleryStorage = @contain.find "@configs-gallery-storage"
    @configsGalleryS3AccessKey = @contain.find "@configs-gallery-s3-access-key"
    @configsGalleryS3SecretKey = @contain.find "@configs-gallery-s3-secret-key"
    @configsGalleryS3Bucket = @contain.find "@configs-gallery-s3-bucket"
    @configsGalleryS3Path = @contain.find "@configs-gallery-s3-path"

  events:
    "submit: @configs-form": "submitConfigsForm"
    "change: @configs-gallery-path": (e) -> configsGalleryModel.updatePath e.target.value
    "change: @configs-gallery-width": (e) -> configsGalleryModel.updateWidth e.target.value
    "change: @configs-gallery-height": (e) -> configsGalleryModel.updateHeight e.target.value
    "change: @configs-gallery-preview-width": (e) -> configsGalleryModel.updatePreviewWidth e.target.value
    "change: @configs-gallery-preview-height": (e) -> configsGalleryModel.updatePreviewHeight e.target.value
    "popup-close: contain": (e) -> @unbind()
    "change: @configs-gallery-storage": (e) -> configsGalleryModel.updateStorage ($ e.target).data "value"
    "change: @configs-gallery-s3-access-key": (e) -> configsGalleryModel.updateS3AccessKey e.target.value
    "change: @configs-gallery-s3-secret-key": (e) -> configsGalleryModel.updateS3SecretKey e.target.value
    "change: @configs-gallery-s3-bucket": (e) -> configsGalleryModel.updateS3Bucket e.target.value
    "change: @configs-gallery-s3-path": (e) -> configsGalleryModel.updateS3Path e.target.value

  initialRender: (state) ->
    (@configsGalleryStorage.filter "[data-value='#{state.storage}']").trigger "click"
    (@contain.find "@configs-gallery-modal-storage-frame").hide()
    (@contain.find "@configs-gallery-modal-storage-#{state.storage}").show()
    @configsGalleryPath.val state.path
    @configsGalleryWidth.val state.width
    @configsGalleryHeight.val state.height
    @configsGalleryPreviewWidth.val state.previewWidth
    @configsGalleryPreviewHeight.val state.previewHeight
    @configsGalleryS3AccessKey.val state.s3AccessKey
    @configsGalleryS3SecretKey.val ""
    @configsGalleryS3Bucket.val state.s3Bucket
    @configsGalleryS3Path.val state.s3Path

  submitConfigsForm: (e) ->
    @trigger "save-configs-modal", configsGalleryModel.getState()
    @unbind()
    return false
