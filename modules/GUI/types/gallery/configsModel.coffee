Model = require "libs/model.coffee"
{httpGet, httpPost} = require "libs/ajax.coffee"
configs = require "types/file/configs.json"

module.exports = class GalleryConfigsModel extends Model
  constructor: (state = {}) ->
    super state

  defaultState: -> configs.defaultSettings

  initial: ->
    @testConnectionS3()
    @checkPath()

  updateStorage: (value) ->
    @set storage: value

    @testConnectionS3() unless @state.s3auth

  updatePath: (value) ->
    @set path: value
    @checkPath()

  checkPath: ->
    httpGet "/cms/types/gallery/checkpath/",
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

      httpGet "/cms/types/gallery/check-s3-connection/",
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
  updateMaxSize: (value) -> @set maxsize: value
  updateSource: (value) -> @set source: value

  getState: -> @state
