View = require "view.coffee"

module.exports = View
  events:
    "change: @checkbox": (e) ->
      $input = $ e.target
      index = $input.data "index"
      @model.update index, e.target.checked
