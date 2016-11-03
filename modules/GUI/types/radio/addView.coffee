View = require "view.coffee"

module.exports = View
  events:
    "change: @radio": (e) ->
      @model.update Number(e.target.getAttribute "data-index")
