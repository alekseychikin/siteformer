Model = require "model.coffee"
httpGet = (require "ajax.coffee").httpGet
httpPost = (require "ajax.coffee").httpPost

module.exports = Model
  initial: ->
    @set
      s3auth: false
      isS3checking: false
      buckets: []
    @testConnectionS3()
    @checkPath()

  updateStorage: (value) ->
    @set storage: value

    @testConnectionS3() unless @state.s3auth

  updatePath: (value) ->
    @set path: value
    @checkPath()

  checkPath: () ->
    httpGet "/cms/types/file/checkpath/",
      path: @state.path
    .then (response) =>
      @set pathError: false
      @set pathError: "Путь не найден" unless response.exists
      @set pathError: "Папка закрыта на запись" unless response.writePermission
    .catch (error) ->
      console.error error

  testConnectionS3: ->
    if @state.storage == "s3" && @state.s3AccessKey && @state.s3SecretKey && !@state.s3auth
      @set isS3checking: true

      httpGet "/cms/types/file/check-s3-connection/",
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
        s3AccessKey: value

  updateS3SecretKey: (value) ->
    if @state.s3SecretKey != value
      @set
        s3auth: false
        buckets: []
        s3SecretKey: value

  updateS3Bucket: (value) -> @set s3Bucket: value

  updateS3Path: (value) -> @set s3Path: value

  getState: -> @state
