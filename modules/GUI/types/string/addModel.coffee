Model = require "model.coffee"

module.exports = Model
  setSettings: (settings) ->
    @set value: settings.defaultValue

  update: (value) ->
    @set {value}

  get: -> @state.value
