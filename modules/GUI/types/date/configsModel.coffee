Model = require "model.coffee"

module.exports = Model
  defaultState: ->
    useTime: false
    useCurrentDate: false

  updateUseTime: (useTime) -> @set {useTime}

  updateUseCurrentDate: (useCurrentDate) -> @set {useCurrentDate}

  getState: -> @state
