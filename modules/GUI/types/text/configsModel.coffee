Model = require "model.coffee"
configs = require "types/text/configs.json"

module.exports = class TextConfigsModel extends Model
  constructor: (state = {}) ->
    super state

  defaultState: -> settings: configs.defaultSettings

  getState: ->
    settings: @state.settings
    index: @state.index

  updateDefaultText: (defaultText) -> @set settings: {defaultText}
