Model = require "model.coffee"

module.exports = Model
  defaultState: -> data: []

  update: (index, checked) ->
    data = if checked then @state.data | (1 << index) else @state.data & ~(1 << index)
    @set {data}

  get: -> @state.data
