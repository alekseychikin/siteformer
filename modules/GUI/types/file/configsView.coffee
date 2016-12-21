View = require "view.coffee"
Render = require "render"
modalWindowTemplate = require "types/file/modal"

module.exports = View
  initial: ->
    @modalContain = Render modalWindowTemplate, @contain[0]

  events:
    "submit: @configs-form": "submitConfigsForm"
    "click: @configs-file-storage": (e) -> @model.updateStorage ($ e.target).data "value"
    "keydown: @configs-file-path": (e) -> @model.resetPath()
    "keyup input: @configs-file-path": (e) ->  @throttling 500, => @model.updatePath e.target.value
    "change: @configs-file-path": (e) ->  @model.updatePath e.target.value
    "change keyup input blur: @configs-file-s3-access-key": (e) ->
      @throttling 500, => @model.updateS3AccessKey e.target.value

    "change keyup input blur: @configs-file-s3-secret-key": (e) ->
      @throttling 500, => @model.updateS3SecretKey e.target.value

    "change: @configs-file-s3-bucket": (e) -> @model.updateS3Bucket e.target.value
    "change keyup input: @configs-file-s3-path": (e) -> @throttling 500, => @model.updateS3Path e.target.value
    "click: @test-connection-s3": (e) -> @model.testConnectionS3()
    "popup-close: contain": (e) -> @destroy()

  render: (state) -> @modalContain state

  submitConfigsForm: (e) ->
    @trigger "save-configs-modal", @model.getState()
    return false
