View = require "view.coffee"

module.exports = View
  events:
    "submit: contain": (e) ->
      @trigger "save", @model.getFields()
      return false
