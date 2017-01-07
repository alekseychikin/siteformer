View = require "view.coffee"

module.exports = View
  events:
    "change: [data-role='cell']": (e) ->
      $input = $ e.target
      rowIndex = + $input.data "row"
      columnIndex = + $input.data "column"

      @model.update rowIndex, columnIndex, e.target.value
