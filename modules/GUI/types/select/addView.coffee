View = require "view.coffee"

module.exports = View
  events:
    "change: [data-role='select']": (e) -> @model.update Number(e.target.value)
