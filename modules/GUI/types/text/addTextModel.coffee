Model = require "model.coffee"

module.exports = Model
  setSettings: (settings) ->
    @set value: ""

  update: (value) -> @set {value}

  get: -> @state.value
