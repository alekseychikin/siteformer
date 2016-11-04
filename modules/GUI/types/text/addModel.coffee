Model = require "model.coffee"

module.exports = Model
  defaultState: -> data: ""

  update: (data) -> @set {data}

  get: -> @state.data
