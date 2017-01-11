Model = require "model.coffee"
configs = require "types/table/configs.json"

module.exports = class TableConfigsModel extends Model
  constructor: (state = {}) ->
    super state

  defaultState: -> settings: configs.defaultSettings

  getState: ->
    settings: @state.settings
    index: @state.index

  updateColumns: (value) ->
    value = parseInt value, 10

    if !isNaN value
      if value > @state.settings.columns
        for row in @state.settings.defaultData
          for i in [@state.settings.columns + 1..value]
            row.push ""
      else if value < @state.settings.columns
        for row in @state.settings.defaultData
          for i in [value + 1..@state.settings.columns]
            row.pop()

      @set settings: columns: value

  updateRows: (value) ->
    value = parseInt value, 10

    if !isNaN value
      if value > @state.settings.rows
        for row in [@state.settings.rows + 1..value]
          row = []
          for i in [1..@state.settings.columns]
            row.push ""
          @state.settings.defaultData.push row
      else if value < @state.settings.rows
        for row in [value + 1..@state.settings.rows]
          @state.settings.defaultData.pop()

      @set settings: rows: value

  updateCellData: (row, column, value) ->
    data = @state.settings.defaultData.slice()
    data[row][column] = value
    @set settings: defaultData: data
