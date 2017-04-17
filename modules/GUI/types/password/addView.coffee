View = require "libs/view.coffee"

module.exports = class PasswordDataView extends View
  constructor: (target, model) -> super target, model

  events:
    "change: [data-role='password']": (e) ->
      @model.update e.target.value
