Model = require "model.coffee"
httpGet = (require "ajax.coffee").httpGet
httpPost = (require "ajax.coffee").httpPost

module.exports = Model
  setFields: (fields) ->
    sources = []

    for field, index in fields
      if field.type == "image" && index != @state.index && field.alias
        sources.push alias: field.alias, label: field.title

    @set {sources}

  initial: ->
    @testConnectionS3()
    @checkPath()

  defaultState: () ->
    storage: "local"
    s3auth: false
    isS3checking: false
    buckets: []
    sources: []
    path: "/"
    width: "0"
    height: "0"
    saveRatio: false
    pathError: false
    s3AccessKey: ""
    s3SecretKey: ""
    s3auth: false
    s3Bucket: ""

  updateStorage: (value) ->
    @set storage: value

    @testConnectionS3() unless @state.s3auth

  updatePath: (value) ->
    @set path: value
    @checkPath()

  checkPath: () ->
    httpGet "/cms/types/image/checkpath/",
      path: @state.path
    .then (response) =>
      @set pathError: false
      @set pathError: "Путь не найден" unless response.exists
      @set pathError: "Папка закрыта на запись" unless response.writePermission
    .catch (error) ->
      console.error error

  resetPath: -> @set pathError: false

  testConnectionS3: ->
    if @state.storage == "s3" && @state.s3AccessKey && @state.s3SecretKey && !@state.s3auth
      @set isS3checking: true

      httpGet "/cms/types/image/check-s3-connection/",
        accessKey: @state.s3AccessKey
        secretKey: @state.s3SecretKey
      .then (response) =>
        @set s3auth: response.auth

        if response.auth
          if @state.s3Bucket not in response.buckets
            @set s3Bucket: response.buckets[0]

          @set buckets: response.buckets

        @set isS3checking: false
      .catch (error) ->
        @set isS3checking: false

        console.error error

  updateS3AccessKey: (value) ->
    if @state.s3AccessKey != value
      @set
        s3auth: false
        buckets: []

    @set s3AccessKey: value

  updateS3SecretKey: (value) ->
    if value && @state.s3SecretKey != value
      @set
        s3auth: false
        buckets: false
        s3SecretKey: value

  updateS3Bucket: (value) -> @set s3Bucket: value

  updateS3Path: (value) ->
    if @state.s3Path != value
      @s3ResetPath()
      @set s3Path: value

  updateWidth: (value) -> @set width: value
  updateHeight: (value) -> @set height: value
  updateSaveRatio: (value) -> @set saveRatio: value
  updateSource: (value) -> @set source: value

  getState: ->
    state = {}
    for key of @state
      state[key] = @state[key] unless key == "fields"
    state
