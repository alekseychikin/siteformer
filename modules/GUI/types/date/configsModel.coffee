Model = require "model.coffee"
configs = require "types/date/configs.json"

module.exports = Model
  defaultState: -> configs.defaultSettings

  updateUseTime: (useTime) -> @set {useTime}

  updateUseCurrentDate: (useCurrentDate) -> @set {useCurrentDate}

  getState: -> @state
