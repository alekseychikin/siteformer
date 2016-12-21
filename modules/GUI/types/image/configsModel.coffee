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

  initial: ->
    sources = []

    for field, index in @state.fields
      if field.type == "image" && index != @state.index && field.alias
        sources.push alias: field.alias, label: field.title

    @set {sources}

    @testConnectionS3()
    @checkPath()

  updateStorage: (storage) ->
    @set settings: {storage}

    @testConnectionS3() unless @state.s3auth

  updatePath: (path) ->
    @set settings: {path}
    @checkPath()

  checkPath: ->
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
    isS3 = @state.settings.storage == "s3"
    isKeys = @state.settings.s3AccessKey && @state.settings.s3SecretKey

    if isS3 && isKeys && !@state.s3auth
      @set s3checking: true

      httpGet "/cms/types/image/check-s3-connection/",
        accessKey: @state.settings.s3AccessKey
        secretKey: @state.settings.s3SecretKey
      .then (response) =>
        @set s3auth: response.auth

        if response.auth
          if @state.settings.s3Bucket not in response.buckets
            @set settings: s3Bucket: response.buckets[0]

          @set buckets: response.buckets

        @set s3checking: false
      .catch (error) ->
        @set s3checking: false

        console.error error

  updateS3AccessKey: (s3AccessKey) ->
    if s3AccessKey && @state.settings.s3AccessKey != s3AccessKey
      @set
        s3auth: false
        buckets: []
        settings: {s3AccessKey}

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
