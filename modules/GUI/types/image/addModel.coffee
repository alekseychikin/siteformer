Model = require "model.coffee"
httpFile = (require "ajax.coffee").httpFile

module.exports = class ImageDataModel extends Model
  constructor: (state = {}) ->
    defaultState =
      readyToSave: false
      data: ""
      previewData: ""

    super Object.assign defaultState, state

    if @state.data.length
      @set
        readyToSave: true
        uploadedPath: @state.data

  setPreview: (input) ->
    @set
      readyToSave: false
      data: ""
      previewData: ""
    @input = input

    data = ''

    if input.files?
      data = input.files[0].name
    else
      filename = input.value.split /[\/\\]/
      data = filename.pop()

    if "FileReader" of window
      reader = new FileReader()

      reader.onload = (e) =>
        @set
          previewData: e.target.result
          data: data

        reader = null

      reader.readAsDataURL input.files[0]
    else
      @set {data}

  setInput: (input) ->
    @input = input

  removePreview: ->
    @set
      readyToSave: false
      data: ""
      previewData: ""

  get: ->
    if @state.readyToSave
      @state.uploadedPath
    else if @input && @state.data
      httpFile "/cms/types/image/uploadimage/",
        image: @input
      .then (response) =>
        @set
          readyToSave: true
          uploadedPath: response.filename
        response.filename
    else
      false
