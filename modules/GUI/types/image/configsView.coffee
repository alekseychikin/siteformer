View = require "view.coffee"
Render = require "render"
modalWindowTemplate = require "types/image/modal"

module.exports = View
  initial: ->
    @modalContain = Render modalWindowTemplate, @contain[0]

  events:
    "submit: @configs-form": "submitConfigsForm"
    "click: @configs-image-storage": (e) -> @model.updateStorage ($ e.target).data "value"
    "keydown: @configs-image-path": (e) -> @model.resetPath()
    "keyup input: @configs-image-path": (e) ->  @throttling 500, => @model.updatePath e.target.value
    "change: @configs-image-path": (e) ->  @model.updatePath e.target.value
    "change keyup input blur: @configs-image-s3-access-key": (e) -> @throttling 500, => @model.updateS3AccessKey e.target.value
    "change keyup input blur: @configs-image-s3-secret-key": (e) -> @throttling 500, => @model.updateS3SecretKey e.target.value
    "change: @configs-image-s3-bucket": (e) -> @model.updateS3Bucket e.target.value
    "change keyup input: @configs-image-s3-path": (e) -> @throttling 500, => @model.updateS3Path e.target.value
    "change: @configs-image-width": (e) -> @model.updateWidth e.target.value
    "change: @configs-image-height": (e) -> @model.updateHeight e.target.value
    "change: @configs-image-save-ratio": (e) -> @model.updateSaveRatio e.target.checked
    "change: @configs-image-source": (e) -> @model.updateSource e.target.value
    "click: @test-connection-s3": (e) -> @model.testConnectionS3()
    "popup-close: contain": (e) -> @destroy()

  render: (state) -> @modalContain state

  submitConfigsForm: (e) ->
    @trigger "save-configs-modal", @model.getState()
    return false
