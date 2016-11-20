Model = require "model.coffee"

module.exports = Model
  defaultState: () -> data: []

  update: (index, checked) ->
    data = @state.data.slice()
    data[index].checked = checked
    @set {data}

  get: ->
    data = @state.data
      .map (item, index) -> if item.checked then 1 << index else null
      .filter (item) -> item != null

    if data.length > 1
      data.reduce (a, b) -> a | b
    else
      data[0] || 0
