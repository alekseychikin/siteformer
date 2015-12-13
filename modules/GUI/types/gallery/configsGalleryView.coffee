View = require "view.coffee"
configsGalleryModel = require "gallery/configsGalleryModel.coffee"
Render = require "render"
modalWindowTemplate = require "types/gallery/modal.tmpl.js"

module.exports = View "TypeGalleryView",
  model: configsGalleryModel

  initial: ->
    @modalContain = Render modalWindowTemplate, @contain[0]

  events:
    "submit: @configs-form": "submitConfigsForm"
    "change: @configs-gallery-path": (e) -> configsGalleryModel.updatePath e.target.value
    "change: @configs-gallery-width": (e) -> configsGalleryModel.updateWidth e.target.value
    "change: @configs-gallery-height": (e) -> configsGalleryModel.updateHeight e.target.value
    "change: @configs-gallery-preview-width": (e) -> configsGalleryModel.updatePreviewWidth e.target.value
    "change: @configs-gallery-preview-height": (e) -> configsGalleryModel.updatePreviewHeight e.target.value
    "change: @configs-gallery-storage": (e) -> configsGalleryModel.updateStorage ($ e.target).data "value"
    "change: @configs-gallery-s3-access-key": (e) -> configsGalleryModel.updateS3AccessKey e.target.value
    "change: @configs-gallery-s3-secret-key": (e) -> configsGalleryModel.updateS3SecretKey e.target.value
    "change: @configs-gallery-s3-bucket": (e) -> configsGalleryModel.updateS3Bucket e.target.value
    "change: @configs-gallery-s3-path": (e) -> configsGalleryModel.updateS3Path e.target.value
    "popup-close: contain": (e) -> @unbind()

  render: (state) ->
    @modalContain state
    ($ "@tabs").tabs()

  submitConfigsForm: (e) ->
    @trigger "save-configs-modal", configsGalleryModel.getState()
    @unbind()
    return false
