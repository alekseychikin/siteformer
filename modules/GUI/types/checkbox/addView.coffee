View = require "view.coffee"

module.exports = View
  events:
    "change: [data-role='checkbox']": (e) ->
      $input = $ e.target
      index = $input.data "index"
      @model.update index, e.target.checked
