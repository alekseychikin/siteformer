View = require "view.coffee"
Render = require "render"
modalWindowTemplate = require "types/gallery/modal.tmpl.js"

module.exports = View
  initial: ->
    @modalContain = Render modalWindowTemplate, @contain[0]

  events:
    "submit: @configs-form": "submitConfigsForm"
    "change: @configs-gallery-path": (e) -> @model.updatePath e.target.value
    "change: @configs-gallery-width": (e) -> @model.updateWidth e.target.value
    "change: @configs-gallery-height": (e) -> @model.updateHeight e.target.value
    "change: @configs-gallery-preview-width": (e) -> @model.updatePreviewWidth e.target.value
    "change: @configs-gallery-preview-height": (e) -> @model.updatePreviewHeight e.target.value
    "change: @configs-gallery-storage": (e) -> @model.updateStorage ($ e.target).data "value"
    "change: @configs-gallery-s3-access-key": (e) -> @model.updateS3AccessKey e.target.value
    "change: @configs-gallery-s3-secret-key": (e) -> @model.updateS3SecretKey e.target.value
    "change: @configs-gallery-s3-bucket": (e) -> @model.updateS3Bucket e.target.value
    "change: @configs-gallery-s3-path": (e) -> @model.updateS3Path e.target.value
    "popup-close: contain": (e) -> @destroy()

  render: (state) ->
    @modalContain state
    ($ "@tabs").tabs()

  submitConfigsForm: (e) ->
    @trigger "save-configs-modal", @model.getState()
    return false
