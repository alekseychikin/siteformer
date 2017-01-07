View = require "view.coffee"

module.exports = View
  events:
    "change: [data-role='area']": (e) -> @model.update e.target.value
