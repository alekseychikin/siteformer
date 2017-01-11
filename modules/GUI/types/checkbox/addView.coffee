View = require "view.coffee"

module.exports = class CheckboxDataView extends View
  constructor: (target, model) -> super target, model

  events:
    "change: [data-role='checkbox']": (e) ->
      $input = $ e.target
      index = $input.data "index"
      @model.update index, e.target.checked
