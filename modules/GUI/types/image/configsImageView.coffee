View = require "view.coffee"
configsImageModel = require "image/configsImageModel.coffee"
Render = require "render"
modalWindowTemplate = require "types/image/modal.tmpl.js"

module.exports = View "TypeImageView",
  model: configsImageModel

  initial: ->
    @modalContain = Render modalWindowTemplate, @contain[0]

  events:
    "submit: @configs-form": "submitConfigsForm"
    "change: @configs-image-storage": (e) -> configsImageModel.updateStorage ($ e.target).data "value"
    "change: @configs-image-path": (e) -> configsImageModel.updatePath e.target.value
    "change: @configs-image-s3-access-key": (e) -> configsImageModel.updateS3AccessKey e.target.value
    "change: @configs-image-s3-secret-key": (e) -> configsImageModel.updateS3SecretKey e.target.value
    "change: @configs-image-s3-bucket": (e) -> configsImageModel.updateS3Bucket e.target.value
    "change: @configs-image-s3-path": (e) -> configsImageModel.updateS3Path e.target.value
    "change: @configs-image-width": (e) -> configsImageModel.updateWidth e.target.value
    "change: @configs-image-height": (e) -> configsImageModel.updateHeight e.target.value
    "change: @configs-image-source": (e) -> configsImageModel.updateSource e.target.value
    "popup-close: contain": (e) -> @unbind()

  render: (state) ->
    @modalContain state
    ($ "@tabs").tabs()

  submitConfigsForm: (e) ->
    @trigger "save-configs-modal", configsImageModel.getState()
    @unbind()
    return false
