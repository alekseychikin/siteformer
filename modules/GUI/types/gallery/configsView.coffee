View = require "view.coffee"
Render = require "render"
modalWindowTemplate = require "types/gallery/modal"

module.exports = View
  initial: ->
    @modalContain = Render modalWindowTemplate, @contain[0]

  events:
    "submit: @configs-form": "submitConfigsForm"
    "click: @configs-gallery-storage": (e) -> @model.updateStorage ($ e.target).data "value"
    "keydown: @configs-gallery-path": (e) -> @model.resetPath()
    "keyup input: @configs-gallery-path": (e) ->  @throttling 500, => @model.updatePath e.target.value
    "change: @configs-gallery-path": (e) ->  @model.updatePath e.target.value
    "change keyup input blur: @configs-gallery-s3-access-key": (e) ->
      @throttling 500, => @model.updateS3AccessKey e.target.value

    "change keyup input blur: @configs-gallery-s3-secret-key": (e) ->
      @throttling 500, => @model.updateS3SecretKey e.target.value

    "change: @configs-gallery-s3-bucket": (e) -> @model.updateS3Bucket e.target.value
    "change keyup input: @configs-gallery-s3-path": (e) ->
      @throttling 500, => @model.updateS3Path e.target.value

    "change: @configs-gallery-width": (e) -> @model.updateWidth e.target.value
    "change: @configs-gallery-height": (e) -> @model.updateHeight e.target.value
    "change: @configs-gallery-maxsize": (e) -> @model.updateMaxSize e.target.value
    "change: @configs-gallery-source": (e) -> @model.updateSource e.target.value
    "click: @test-connection-s3": (e) -> @model.testConnectionS3()
    "popup-close: contain": (e) -> @destroy()

  render: (state) -> @modalContain state

  submitConfigsForm: (e) ->
    @trigger "save-configs-modal", @model.getState()
    return false
