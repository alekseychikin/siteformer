View = require "view.coffee"

module.exports = View
  events:
    "submit: contain": (e) ->
      @model.save()
      return false
