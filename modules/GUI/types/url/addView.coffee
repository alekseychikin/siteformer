View = require "view.coffee"

module.exports = View
  events:
    "change: @url": (e) -> @model.update e.target.value
