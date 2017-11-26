View = require "libs/view.coffee"
render = require "libs/render"
formTemplate = require "dist/sections/main/setup-database-form.gutt"

module.exports = class SetupDatabaseView extends View
  constructor: (target, model) ->
    super target, model
    @renderForm = render formTemplate, target

  render: (state) -> @renderForm state

  events:
    "submit: contain": (e) ->
      @model.saveConfigs()
      e.preventDefault()
      return false
