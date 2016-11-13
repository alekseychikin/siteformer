Model = require "model.coffee"
configs = require "types/date/configs.json"

module.exports = Model
  defaultState: -> settings: configs.defaultSettings

  updateUseTime: (useTime) -> @set settings: {useTime}

  updateUseCurrentDate: (useCurrentDate) -> @set settings: {useCurrentDate}

  getState: ->
    settings: @state.settings
    index: @state.index
