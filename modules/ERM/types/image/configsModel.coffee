Model = require "libs/model.coffee"
{httpGet, httpPost} = require "libs/helpers.coffee"
configs = require "types/image/configs.json"

module.exports = class ImageConfigsModel extends Model
  constructor: (state = {}) ->
    super state

    sources = []

    for field, index in @state.fields
      if field.type == "image" && index != @state.index && field.alias
        sources.push alias: field.alias, label: field.title

    @set {sources}

    @testConnectionS3()
    @checkPath()

  defaultState: ->
    settings: configs.defaultSettings
    s3checking: false
    s3auth: false
    buckets: []
    pathError: false
    sources: []

  updateStorage: (storage) ->
    @set settings: {storage}

    @testConnectionS3() unless @state.s3auth

  updatePath: (path) ->
    if @state.settings.path != path
      @set settings: {path}
      @checkPath()

  checkPath: ->
    if @state.settings.storage == "local"
      httpGet "/cms/types/image/checkpath/",
        path: @state.settings.path
      .then =>
        @set
          pathError: false
          settings:
            errorIndex: []
            errorCode: ""

      .catch (response) =>
        @set pathError: true

        if response.error? && response.error.message?
          @set
            settings:
              errorIndex: response.error.message.index
              errorCode: response.error.message.code

  testConnectionS3: ->
    isS3 = @state.settings.storage == "s3"
    isKeys = @state.settings.s3AccessKey && @state.settings.s3SecretKey

    console.log "connect", isS3, isKeys

    if isS3 && isKeys && !@state.s3auth
      @set s3checking: true

      httpGet "/cms/types/image/check-s3-connection/",
        accessKey: @state.settings.s3AccessKey
        secretKey: @state.settings.s3SecretKey
      .then (response) =>
        @set s3auth: true

        if @state.settings.s3Bucket not in response.buckets
          @set settings: s3Bucket: response.buckets[0]

        @set
          buckets: response.buckets
          s3checking: false
      .catch (response) =>
        if response.error? && response.error.message?
          @set
            settings:
              errorIndex: response.error.message.index
              errorCode: response.error.message.code

          @set s3checking: false

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
