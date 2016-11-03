View = require "view.coffee"

module.exports = View
  events:
    "change: @string": (e) -> @model.update e.target.value
