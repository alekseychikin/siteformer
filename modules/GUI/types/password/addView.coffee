View = require "view.coffee"

module.exports = View
  events:
    "change: @password": (e) ->
      @model.update e.target.value
