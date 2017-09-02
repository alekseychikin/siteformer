Model = require "libs/model.coffee"

dispatcher = require "libs/dispatcher.coffee"

stringComponent = require "types/string/item.coffee"
selectComponent = require "types/select/item.coffee"

{throttle, httpPost} = require "libs/helpers.coffee"

fetchData = (host, user, password) ->
  ->
    httpPost window.location.href,
      host: host,
      user: user,
      password: password,
      checkConnection: true

module.exports = class SetupDatabaseModel extends Model
  constructor: (state = {}) ->
    super Object.assign {
      host: "localhost"
      user: ""
      password: ""
      database: ""
    }, state

    dispatcher.on "field-change-value", (action) =>
      switch action.alias
        when "host"
          @set host: action.value
          @getDatabases()
          break
        when "user"
          @set user: action.value
          @getDatabases()
          break
        when "password"
          @set password: action.value
          @getDatabases()
          break
        when "database"
          @set database: action.value
          break

  saveConfigs: -> @trigger "save-configs", @state

  getDatabases: ->
    if @state.host && @state.user
      Promise.resolve()
      .then throttle 400
      .then fetchData @state.host, @state.user, @state.password
      .then (response) => @set databases: response.databases
    else
      @set databases: []
