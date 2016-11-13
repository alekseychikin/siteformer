Model = require "model.coffee"
httpGet = (require "ajax.coffee").httpGet
httpPost = (require "ajax.coffee").httpPost
configs = require "types/image/configs.json"

module.exports = Model
  defaultState: ->
    settings: configs.defaultSettings
    s3checking: false
    s3auth: false
    buckets: []
    pathError: false
    sources: []

  setFields: (fields) ->
    sources = []

    for field, index in fields
      if field.type == "image" && index != @state.index && field.alias
        sources.push alias: field.alias, label: field.title

    @set {sources}

  initial: ->
    @testConnectionS3()
    @checkPath()

  updateStorage: (storage) ->
    @set settings: {storage}

    @testConnectionS3() unless @state.s3auth

  updatePath: (path) ->
    @set settings: {path}
    @checkPath()

  checkPath: () ->
    httpGet "/cms/types/image/checkpath/",
      path: @state.settings.path
    .then (response) =>
      @set pathError: false
      @set pathError: "Путь не найден" unless response.exists
      @set pathError: "Папка закрыта на запись" unless response.writePermission
    .catch (error) ->
      console.error error

  resetPath: -> @set pathError: false

  testConnectionS3: ->
    if @state.storage == "s3" && @state.s3AccessKey && @state.s3SecretKey && !@state.s3auth
      @set s3checking: true

      httpGet "/cms/types/image/check-s3-connection/",
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
      @set
        s3auth: false
        buckets: []

    @set s3AccessKey: value

  updateS3SecretKey: (s3SecretKey) ->
    if s3SecretKey && @state.settings.s3SecretKey != s3SecretKey
      @set
        s3auth: false
        buckets: false
        settings: {s3SecretKey}

  updateS3Bucket: (s3Bucket) -> @set settings: {s3Bucket}

  updateS3Path: (s3Path) ->
    if @state.settings.s3Path != s3Path
      @set settings: {s3Path}

  updateWidth: (width) -> @set settings: {width}
  updateHeight: (height) -> @set settings: {height}
  updateSaveRatio: (saveRatio) -> @set settings: {saveRatio}
  updateSource: (source) -> @set settings: {source}

  getState: ->
    settings: @state.settings
    index: @state.index
