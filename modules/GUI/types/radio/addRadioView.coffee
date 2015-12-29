View = require "view.coffee"

module.exports = View
  events:
    "change: @radio": (e) ->
      $input = $ e.target
      @model.update $input.data "index"
