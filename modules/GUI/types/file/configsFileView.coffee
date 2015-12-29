View = require "view.coffee"
Render = require "render"
modalWindowTemplate = require "types/file/modal.tmpl.js"

module.exports = View
  initial: ->
    @modalContain = Render modalWindowTemplate, @contain[0]

  events:
    "submit: @configs-form": "submitConfigsForm"
    "change: @configs-file-storage": (e) -> @model.updateStorage ($ e.target).data "value"
    "change: @configs-file-path": (e) -> @model.updatePath e.target.value
    "change: @configs-file-width": (e) -> @model.updateWidth e.target.value
    "change: @configs-file-height": (e) -> @model.updateHeight e.target.value
    "change: @configs-file-source": (e) -> @model.updateSource e.target.value
    "change: @configs-file-s3-access-key": (e) -> @model.updateS3AccessKey e.target.value
    "change: @configs-file-s3-secret-key": (e) -> @model.updateS3SecretKey e.target.value
    "change: @configs-file-s3-bucket": (e) -> @model.updateS3Bucket e.target.value
    "change: @configs-file-s3-path": (e) -> @model.updateS3Path e.target.value
    "popup-close: contain": (e) -> @destroy()

  render: (state) ->
    @modalContain state
    ($ "@tabs").tabs()

  submitConfigsForm: (e) ->
    @trigger "save-configs-modal", @model.getState()
    return false
