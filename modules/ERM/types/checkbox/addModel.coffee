Model = require "libs/model.coffee"

module.exports = class CheckboxDataModel extends Model
  constructor: (state = {data: []}) -> super state

  update: (index, checked) ->
    data = if checked then @state.data | (1 << index) else @state.data & ~(1 << index)
    @set {data}

  get: -> @state.data
