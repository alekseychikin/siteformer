View = require "view.coffee"

module.exports = View
  events:
    "change: @select": (e) -> @model.update Number(e.target.value)
