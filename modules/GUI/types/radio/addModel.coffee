Model = require "model.coffee"

module.exports = Model
  setSettings: (settings) ->
    @set value: + settings.defaultValue

  update: (value) ->
    @set value: + value

  get: -> @state.value
