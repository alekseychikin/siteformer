Model = require "libs/model.coffee"

module.exports = class TableDataModel extends Model
  constructor: (state = {}) -> super state

  setSettings: (settings) ->
    @set data: settings.defaultData.slice()

  update: (rowIndex, columnIndex, value) ->
    data = @state.data.slice()
    data[rowIndex][columnIndex] = value

    @set {data}

  get: -> @state.data
