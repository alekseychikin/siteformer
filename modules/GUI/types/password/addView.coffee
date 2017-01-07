View = require "view.coffee"

module.exports = View
  events:
    "change: [data-role='password']": (e) ->
      @model.update e.target.value
