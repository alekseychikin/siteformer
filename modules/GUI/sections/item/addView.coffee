View = require "view.coffee"

module.exports = View
  events:
    "submit: contain": (e) ->
      @model.save()
      return false

    "click: [data-role='delete']": -> @model.delete()
