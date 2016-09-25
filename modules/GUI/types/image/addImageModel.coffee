Model = require "model.coffee"
Promise = require "promise"
httpFile = (require "ajax.coffee").httpFile

module.exports = Model
  setPreview: (input) ->
    @set readyToSave: false
    @input = input
    if input.files?
      @set filename: input.files[0].name
    else
      filename = input.value.split /[\/\\]/
      @set filename: filename.pop()

  setInput: (input) ->
    @input = input

  removePreview: ->
    @set filename: false
    @set readyToSave: false

  get: ->
    if @state.readyToSave
      @state.uploadedPath
    else if @input && @state.filename
      httpFile "/cms/types/image/uploadimage/",
        image: @input
      .then (response) =>
        @set readyToSave: true
        @set uploadedPath: response.filename
        response.filename
    else
      false
