Model = require "model.coffee"

module.exports = Model
  setSettings: (settings) ->
    defaultValue = + settings.defaultValue
    if defaultValue == -1
      @set value: ""
    else
      @set value: settings.defaultValue

  update: (value) -> @set value: + value

  get: -> @state.value
