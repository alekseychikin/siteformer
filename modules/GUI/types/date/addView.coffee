View = require "view.coffee"

module.exports = View
  initial: ->
    @model.updateDate (@contain.find "@date").val()
    @model.updateTime (@contain.find "@time").val()

  events:
    "change: @date": (e) -> @model.updateDate e.target.value
    "change: @time": (e) -> @model.updateTime e.target.value
