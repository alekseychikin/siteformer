View = require "libs/view.coffee"

module.exports = class CheckboxDataView extends View
  constructor: (target, model) -> super target, model

  events:
    "change: [data-role='checkbox']": (e) ->
      @model.update (e.target.getAttribute "data-index"), e.target.checked
