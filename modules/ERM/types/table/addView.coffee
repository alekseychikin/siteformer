View = require "libs/view.coffee"

module.exports = class TableDataView extends View
  constructor: (target, model) -> super target, model

  events:
    "change: [data-role='cell']": (e) ->
      rowIndex = Number e.target.getAttribute "data-row"
      columnIndex = Number e.target.getAttribute "data-column"

      @model.update rowIndex, columnIndex, e.target.value
