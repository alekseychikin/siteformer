Model = require "model.coffee"

module.exports = Model "TypeTableModel",

  getState: -> @state

  updateColumns: (value) ->
    value = parseInt value, 10
    if value > @state.columns
      for row in @state.defaultData
        for i in [@state.columns + 1..value]
          row.push ""
    else if value < @state.columns
      for row in @state.defaultData
        for i in [value + 1..@state.columns]
          row.pop()
    @set columns: value

  updateRows: (value) ->
    value = parseInt value, 10
    if value > @state.rows
      for row in [@state.rows + 1..value]
        row = []
        for i in [1..@state.columns]
          row.push ""
        @state.defaultData.push row
    else if value < @state.rows
      for row in [value + 1..@state.rows]
        @state.defaultData.pop()
    @set rows: value

  updateCellData: (row, column, value) -> @state.defaultData[row][column] = value
