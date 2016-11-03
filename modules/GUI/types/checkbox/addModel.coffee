Model = require "model.coffee"

module.exports = Model
  setSettings: (settings) ->
    data = []
    data = settings.defaultData.slice()
    settings.defaultData.slice().map (item, index) -> if (typeof item.checked) == "string" then data[index] = item.checked == "true" else data[index] = item.checked
    @set {data}

  update: (index, checked) ->
    data = @state.data.slice()
    data[index] = checked
    @set {data}

  get: -> @state.data
