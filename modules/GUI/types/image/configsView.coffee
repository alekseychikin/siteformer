View = require "view.coffee"
Render = require "render"
modalWindowTemplate = require "types/image/modal.tmplt"

module.exports = class ImageConfigsView extends View
  constructor: (target, model) ->
    super target, model

    @modalContain = Render modalWindowTemplate, @contain
    @render @model.state

  events:
    "submit: [data-role='configs-form']": "submitConfigsForm"
    "click: [data-role='configs-image-storage']": (e) -> @model.updateStorage e.target.getAttribute "data-value"
    "keydown: [data-role='configs-image-path']": (e) -> @model.resetPath()
    "keyup input: [data-role='configs-image-path']": (e) ->  @throttling 500, => @model.updatePath e.target.value
    "change: [data-role='configs-image-path']": (e) ->  @model.updatePath e.target.value
    "change keyup input blur: [data-role='configs-image-s3-access-key']": (e) ->
      @throttling 500, => @model.updateS3AccessKey e.target.value

    "change keyup input blur: [data-role='configs-image-s3-secret-key']": (e) ->
      @throttling 500, => @model.updateS3SecretKey e.target.value

    "change: [data-role='configs-image-s3-bucket']": (e) -> @model.updateS3Bucket e.target.value
    "change keyup input: [data-role='configs-image-s3-path']": (e) ->
      @throttling 500, => @model.updateS3Path e.target.value

    "change: [data-role='configs-image-width']": (e) -> @model.updateWidth e.target.value
    "change: [data-role='configs-image-height']": (e) -> @model.updateHeight e.target.value
    "change: [data-role='configs-image-save-ratio']": (e) -> @model.updateSaveRatio e.target.checked
    "change: [data-role='configs-image-source']": (e) -> @model.updateSource e.target.value
    "click: [data-role='test-connection-s3']": (e) -> @model.testConnectionS3()
    "popup-close: contain": (e) -> @destroy()

  render: (state) -> @modalContain state

  submitConfigsForm: (e) ->
    @trigger "save-configs-modal", @model.getState()
    e.preventDefault()
