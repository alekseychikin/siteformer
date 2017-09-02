{httpGet, httpPost} = require "libs/helpers.coffee"

SetupDatabaseModel = require "./setupDatabaseModel.coffee"
SetupDatabaseView = require "./setupDatabaseView.coffee"

httpGet window.location.href
.then (state) ->
  setupDatabaseModel = new SetupDatabaseModel
  setupDatabaseView = new SetupDatabaseView (document.querySelector "[data-role='setup-database-container']"), setupDatabaseModel

  setupDatabaseModel.on "save-configs", (state) ->
    httpPost window.location.href,
      host: state.host
      user: state.user
      password: state.password
      database: state.database
      validateConfigs: true
    .then (response) =>
      console.log response
