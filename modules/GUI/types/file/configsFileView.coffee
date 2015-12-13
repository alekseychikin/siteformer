View = require "view.coffee"
configsFileModel = require "file/configsFileModel.coffee"
Render = require "render"
modalWindowTemplate = require "types/file/modal.tmpl.js"

module.exports = View "TypeFileView",
  model: configsFileModel

  initial: ->
    @modalContain = Render modalWindowTemplate, @contain[0]

  events:
    "submit: @configs-form": "submitConfigsForm"
    "change: @configs-file-storage": (e) -> configsFileModel.updateStorage ($ e.target).data "value"
    "change: @configs-file-path": (e) -> configsFileModel.updatePath e.target.value
    "change: @configs-file-width": (e) -> configsFileModel.updateWidth e.target.value
    "change: @configs-file-height": (e) -> configsFileModel.updateHeight e.target.value
    "change: @configs-file-source": (e) -> configsFileModel.updateSource e.target.value
    "change: @configs-file-s3-access-key": (e) -> configsFileModel.updateS3AccessKey e.target.value
    "change: @configs-file-s3-secret-key": (e) -> configsFileModel.updateS3SecretKey e.target.value
    "change: @configs-file-s3-bucket": (e) -> configsFileModel.updateS3Bucket e.target.value
    "change: @configs-file-s3-path": (e) -> configsFileModel.updateS3Path e.target.value
    "popup-close: contain": (e) -> @unbind()

  render: (state) ->
    @modalContain state
    ($ "@tabs").tabs()

  submitConfigsForm: (e) ->
    @trigger "save-configs-modal", configsFileModel.getState()
    @unbind()
    return false
