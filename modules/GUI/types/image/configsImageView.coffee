View = require "view.coffee"
configsImageModel = require "image/configsImageModel.coffee"

module.exports = View "TypeImageView",
  model: configsImageModel
  debug: false

  initial: ->
    @configsImagePath = @contain.find "@configs-image-path"
    @configsImageSource = @contain.find "@configs-image-source"
    @configsImageWidth = @contain.find "@configs-image-width"
    @configsImageHeight = @contain.find "@configs-image-height"
    @configsImageIndex = @contain.find "@configs-image-index"

  events:
    "submit: @configs-form": "submitConfigsForm"
    "change: @configs-image-path": (e) -> configsImageModel.updatePath e.target.value
    "change: @configs-image-width": (e) -> configsImageModel.updateWidth e.target.value
    "change: @configs-image-height": (e) -> configsImageModel.updateHeight e.target.value
    "change: @configs-image-source": (e) -> configsImageModel.updateSource e.target.value
    "popup-close: contain": (e) -> @unbind()

  initialRender: (state) ->
    @configsImageIndex.val state.index
    @configsImagePath.val state.path
    @configsImageWidth.val state.width
    @configsImageHeight.val state.height
    @configsImageSource.val state.source

  submitConfigsForm: (e) ->
    @trigger "save-configs-modal", $(e.target).serializeObject()
    @unbind()
    return false
