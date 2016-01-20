View = require "view.coffee"

module.exports = View
  events:
    "change: @area": (e) -> @model.update e.target.value
