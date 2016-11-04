Model = require "model.coffee"

module.exports = Model
  getState: -> @state

  defaultState: ->
    defaultText: ""

  updateDefaultText: (defaultText) -> @set {defaultText}
