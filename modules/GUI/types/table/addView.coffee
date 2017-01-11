View = require "view.coffee"

module.exports = class TableDataView extends View
  constructor: (target, model) -> super target, model

  events:
    "change: [data-role='cell']": (e) ->
      $input = $ e.target
      rowIndex = + $input.data "row"
      columnIndex = + $input.data "column"

      @model.update rowIndex, columnIndex, e.target.value
