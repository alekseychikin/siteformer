View = require "libs/view.coffee"
Render = require "libs/render"
modalWindowTemplate = require "dist/types/gallery/modal.tmplt"

module.exports = class GalleryConfigsView extends View
  constructor: (target, model) ->
    super target, model

    @modalContain = Render modalWindowTemplate, @contain
    @render @model.state

  events:
    "submit: [data-role='configs-form']": "submitConfigsForm"
    "click: [data-role='configs-gallery-storage']": (e) -> @model.updateStorage ($ e.target).data "value"
    "keydown: [data-role='configs-gallery-path']": (e) -> @model.resetPath()
    "keyup input: [data-role='configs-gallery-path']": (e) ->  @throttling 500, => @model.updatePath e.target.value
    "change: [data-role='configs-gallery-path']": (e) ->  @model.updatePath e.target.value
    "change keyup input blur: [data-role='configs-gallery-s3-access-key']": (e) ->
      @throttling 500, => @model.updateS3AccessKey e.target.value

    "change keyup input blur: [data-role='configs-gallery-s3-secret-key']": (e) ->
      @throttling 500, => @model.updateS3SecretKey e.target.value

    "change: [data-role='configs-gallery-s3-bucket']": (e) -> @model.updateS3Bucket e.target.value
    "change keyup input: [data-role='configs-gallery-s3-path']": (e) ->
      @throttling 500, => @model.updateS3Path e.target.value

    "change: [data-role='configs-gallery-width']": (e) -> @model.updateWidth e.target.value
    "change: [data-role='configs-gallery-height']": (e) -> @model.updateHeight e.target.value
    "change: [data-role='configs-gallery-maxsize']": (e) -> @model.updateMaxSize e.target.value
    "change: [data-role='configs-gallery-source']": (e) -> @model.updateSource e.target.value
    "click: [data-role='test-connection-s3']": (e) -> @model.testConnectionS3()
    "popup-close: contain": (e) -> @destroy()

  render: (state) -> @modalContain state

  submitConfigsForm: (e) ->
    @trigger "save-configs-modal", @model.getState()
    e.preventDefault()
