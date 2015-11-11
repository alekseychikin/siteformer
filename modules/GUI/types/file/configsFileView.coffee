View = require "view.coffee"
Render = require "render.coffee"
configsFileModel = require "file/configsFileModel.coffee"

module.exports = View "TypeFileView",
  model: configsFileModel

  initial: ->
    @configsFilePath = @contain.find "@configs-file-path"
    @configsFileSource = @contain.find "@configs-file-source"
    @configsFileWidth = @contain.find "@configs-file-width"
    @configsFileHeight = @contain.find "@configs-file-height"
    @configsFileIndex = @contain.find "@configs-file-index"
    @configsFileStorage = @contain.find "@configs-file-storage"
    @configsFileS3AccessKey = @contain.find "@configs-file-s3-access-key"
    @configsFileS3SecretKey = @contain.find "@configs-file-s3-secret-key"
    @configsFileS3Bucket = @contain.find "@configs-file-s3-bucket"
    @configsFileS3Path = @contain.find "@configs-file-s3-path"

  events:
    "submit: @configs-form": "submitConfigsForm"
    "change: @configs-file-storage": (e) -> configsFileModel.updateStorage ($ e.target).data "value"
    "change: @configs-file-path": (e) -> configsFileModel.updatePath e.target.value
    "change: @configs-file-width": (e) -> configsFileModel.updateWidth e.target.value
    "change: @configs-file-height": (e) -> configsFileModel.updateHeight e.target.value
    "change: @configs-file-source": (e) -> configsFileModel.updateSource e.target.value
    "popup-close: contain": (e) -> @unbind()
    "change: @configs-file-s3-access-key": (e) -> configsFileModel.updateS3AccessKey e.target.value
    "change: @configs-file-s3-secret-key": (e) -> configsFileModel.updateS3SecretKey e.target.value
    "change: @configs-file-s3-bucket": (e) -> configsFileModel.updateS3Bucket e.target.value
    "change: @configs-file-s3-path": (e) -> configsFileModel.updateS3Path e.target.value

  initialRender: (state) ->
    (@configsFileStorage.filter "[data-value='#{state.storage}']").trigger "click"
    (@contain.find "@configs-file-modal-storage-frame").hide()
    (@contain.find "@configs-file-modal-storage-#{state.storage}").show()
    @configsFilePath.val state.path
    @configsFileWidth.val state.width
    @configsFileHeight.val state.height
    @configsFileSource.val state.source
    @configsFileS3AccessKey.val state.s3AccessKey
    @configsFileS3SecretKey.val ""
    @configsFileS3Bucket.val state.s3Bucket
    @configsFileS3Path.val state.s3Path

  submitConfigsForm: (e) ->
    @trigger "save-configs-modal", configsFileModel.getState()
    @unbind()
    return false
