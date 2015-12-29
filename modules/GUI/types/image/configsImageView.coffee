View = require "view.coffee"
Render = require "render"
modalWindowTemplate = require "types/image/modal.tmpl.js"

module.exports = View

  initial: ->
    @modalContain = Render modalWindowTemplate, @contain[0]

  events:
    "submit: @configs-form": "submitConfigsForm"
    "change: @configs-image-storage": (e) -> @model.updateStorage ($ e.target).data "value"
    "change: @configs-image-path": (e) -> @model.updatePath e.target.value
    "change: @configs-image-s3-access-key": (e) -> @model.updateS3AccessKey e.target.value
    "change: @configs-image-s3-secret-key": (e) -> @model.updateS3SecretKey e.target.value
    "change: @configs-image-s3-bucket": (e) -> @model.updateS3Bucket e.target.value
    "change: @configs-image-s3-path": (e) -> @model.updateS3Path e.target.value
    "change: @configs-image-width": (e) -> @model.updateWidth e.target.value
    "change: @configs-image-height": (e) -> @model.updateHeight e.target.value
    "change: @configs-image-source": (e) -> @model.updateSource e.target.value
    "popup-close: contain": (e) -> @destroy()
    "popup-close: contain": (e) -> @destroy()

  render: (state) ->
    @modalContain state
    ($ "@tabs").tabs()

  submitConfigsForm: (e) ->
    @trigger "save-configs-modal", @model.getState()
    return false
