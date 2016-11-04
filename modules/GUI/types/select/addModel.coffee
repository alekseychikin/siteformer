Model = require "model.coffee"

module.exports = Model
  defaultState: -> data: -1

  update: (data) -> @set {data}

  get: -> @state.data
