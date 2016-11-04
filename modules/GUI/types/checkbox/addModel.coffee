Model = require "model.coffee"

module.exports = Model
  defaultState: () -> data: []

  update: (index, checked) ->
    data = @state.data.slice()
    data[index].checked = checked
    @set {data}

  get: ->
    @state.data
      .map (item, index) -> if item.checked then 1 << index else null
      .filter (item) -> item != null
      .reduce (a, b) -> a | b
