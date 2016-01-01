Model = require "model.coffee"
httpGet = (require "ajax.coffee").httpGet
httpPost = (require "ajax.coffee").httpPost

module.exports = Model
  setFields: (fields) ->
    sources = []
    for field, index in  fields
      if field.type == "image" && index != @state.index && field.alias.length
        sources.push alias: field.alias, label: field.title
    @set {sources}

  initial: ->
    @testConnectionS3()
    @checkPath()

  updateStorage: (value) ->
    @set storage: value
    if !@state.s3auth
      @testConnectionS3()

  updatePath: (value) ->
    @set path: value
    @checkPath()

  checkPath: () ->
    httpPost "/cms/types/image/checkpath/__json/",
      path: @state.path
    .then (response) =>
      @set pathError: false
      @set pathError: "Путь не найден" if !response.exists
      @set pathError: "Папка закрыта на запись" if !response.writePermission
    .catch (error) ->
      console.error error

  resetPath: -> @set pathError: false

  testConnectionS3: ->
    if @state.storage == "s3" && @state.s3AccessKey.length && @state.s3SecretKey.length && !@state.s3auth
      @set s3checking: true
      httpGet "/cms/types/image/check-s3-connection/__json/",
        accessKey: @state.s3AccessKey
        secretKey: @state.s3SecretKey
      .then (response) =>
        @set s3auth: response.auth
        if response.auth
          if @state.s3Bucket not in response.buckets
            @set s3Bucket: response.buckets[0]
          @set buckets: response.buckets
        @set s3checking: false
      .catch (error) ->
        @set s3checking: false
        console.error error

  updateS3AccessKey: (value) ->
    if @state.s3AccessKey != value
      @set s3auth: false
      @set buckets: false
    @set s3AccessKey: value

  updateS3SecretKey: (value) ->
    if @state.s3SecretKey != value
      @set s3auth: false
      @set buckets: false
    @set s3SecretKey: value

  updateS3Bucket: (value) ->
    @set s3Bucket: value
    @checkS3Path()

  updateS3Path: (value) ->
    if @state.s3Path != value
      @s3ResetPath()
      @set s3Path: value
      @checkS3Path()

  checkS3Path: ->
    if @state.s3auth
      httpGet "/cms/types/image/check-s3-path/__json/",
        path: @state.s3Path
        accessKey: @state.s3AccessKey
        secretKey: @state.s3SecretKey
        bucket: @state.s3Bucket
      .then (response) =>
        @set s3PathError: false
        @set s3PathError: "Путь не найден" if !response.exists

  s3ResetPath: -> @set s3PathError: false

  updateWidth: (value) -> @set width: value
  updateHeight: (value) -> @set height: value
  updateSource: (value) -> @set source: value

  getState: ->
    @state
