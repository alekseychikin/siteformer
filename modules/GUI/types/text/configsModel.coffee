Model = require "model.coffee"
configs = require "types/text/configs.json"

module.exports = Model
  defaultState: -> configs.defaultSettings

  getState: -> @state

  updateDefaultText: (defaultText) -> @set {defaultText}
