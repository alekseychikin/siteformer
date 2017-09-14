View = require "libs/view.coffee"

module.exports = class DateDataView extends View
  constructor: (target, model) ->
    super target, model

    @model.updateDate (@contain.querySelector "[data-role='date']").value

    if (@contain.querySelector "[data-role='time']")
      @model.updateTime (@contain.querySelector "[data-role='time']").value

  events:
    "change: [data-role='date']": (e) -> @model.updateDate e.target.value
    "change: [data-role='time']": (e) -> @model.updateTime e.target.value
