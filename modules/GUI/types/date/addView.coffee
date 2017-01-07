View = require "view.coffee"

module.exports = View
  initial: ->
    @model.updateDate (@contain.find "[data-role='date']").val()
    @model.updateTime (@contain.find "[data-role='time']").val()

  events:
    "change: [data-role='date']": (e) -> @model.updateDate e.target.value
    "change: [data-role='time']": (e) -> @model.updateTime e.target.value
