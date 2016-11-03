Model = require "model.coffee"

module.exports = Model
  setSettings: (settings) ->
    @set data: settings.defaultData.slice()

  update: (rowIndex, columnIndex, value) ->
    data = @state.data.slice()
    data[rowIndex][columnIndex] = value
    @set {data}

  get: -> @state.data
