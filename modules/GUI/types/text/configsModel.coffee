Model = require "model.coffee"
configs = require "types/text/configs.json"

module.exports = Model
  defaultState: -> settings: configs.defaultSettings

  getState: ->
    settings: @state.settings
    index: @state.index

  updateDefaultText: (defaultText) -> @set settings: {defaultText}
