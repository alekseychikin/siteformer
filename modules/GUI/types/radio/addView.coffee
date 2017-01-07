View = require "view.coffee"

module.exports = View
  events:
    "change: [data-role='radio']": (e) ->
      @model.update Number(e.target.getAttribute "data-index")
